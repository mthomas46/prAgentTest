module Services.ServiceList exposing (Model, Msg, init, subscriptions, update, view)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Http
import Json.Decode as Decode
import Services.Api as Api
import Time

-- MODEL

type alias Model =
    { services : List Api.Service
    , selectedService : Maybe String
    , serviceHealth : Maybe Api.ServiceHealth
    , loading : Bool
    , error : Maybe String
    }

init : ( Model, Cmd Msg )
init =
    ( { services = []
      , selectedService = Nothing
      , serviceHealth = Nothing
      , loading = True
      , error = Nothing
      }
    , Api.fetchServices GotServices
    )

-- UPDATE

type Msg
    = GotServices (Result Http.Error (List Api.Service))
    | SelectService String
    | GotServiceHealth (Result Http.Error Api.ServiceHealth)
    | RefreshServices
    | Tick Time.Posix

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotServices result ->
            case result of
                Ok services ->
                    ( { model
                        | services = services
                        , loading = False
                        , error = Nothing
                      }
                    , Cmd.none
                    )

                Err httpError ->
                    ( { model
                        | loading = False
                        , error = Just (errorToString httpError)
                      }
                    , Cmd.none
                    )

        SelectService serviceId ->
            ( { model
                | selectedService = Just serviceId
                , serviceHealth = Nothing
                , loading = True
              }
            , Api.fetchServiceHealth serviceId GotServiceHealth
            )

        GotServiceHealth result ->
            case result of
                Ok health ->
                    ( { model
                        | serviceHealth = Just health
                        , loading = False
                        , error = Nothing
                      }
                    , Cmd.none
                    )

                Err httpError ->
                    ( { model
                        | loading = False
                        , error = Just (errorToString httpError)
                      }
                    , Cmd.none
                    )

        RefreshServices ->
            ( { model | loading = True }
            , Api.fetchServices GotServices
            )

        Tick _ ->
            if model.loading == False then
                ( model, Api.fetchServices GotServices )
            else
                ( model, Cmd.none )

-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions _ =
    Time.every 30000 Tick

-- VIEW

view : Model -> Html Msg
view model =
    div [ class "services-page" ]
        [ div [ class "services-header" ]
            [ h1 [] [ text "Service Directory" ]
            , p [ class "description" ] [ text "View and manage all services in your microservices architecture" ]
            , button 
                [ class "refresh-button"
                , onClick RefreshServices
                ] 
                [ text "Refresh" ]
            ]
        , div [ class "services-container" ]
            [ viewServicesList model
            , viewServiceDetails model
            ]
        ]

viewServicesList : Model -> Html Msg
viewServicesList model =
    div [ class "services-list-container" ]
        [ h2 [] [ text "Available Services" ]
        , if model.loading && List.isEmpty model.services then
            div [ class "loading" ] [ text "Loading services..." ]
          else if List.isEmpty model.services then
            div [ class "no-services" ] [ text "No services available" ]
          else
            div [ class "services-list" ]
                (List.map (viewServiceItem model.selectedService) model.services)
        ]

viewServiceItem : Maybe String -> Api.Service -> Html Msg
viewServiceItem selectedService service =
    let
        isSelected =
            selectedService == Just service.id
                
        selectedClass =
            if isSelected then "selected" else ""
    in
    div 
        [ class ("service-item " ++ selectedClass)
        , onClick (SelectService service.id)
        ] 
        [ div [ class "service-item-header" ]
            [ h3 [ class "service-item-title" ] [ text service.name ]
            , div 
                [ class ("status-indicator " ++ statusClass service.status) 
                , title (statusText service.status)
                ] 
                []
            ]
        , p [ class "service-item-description" ] [ text service.description ]
        ]

viewServiceDetails : Model -> Html Msg
viewServiceDetails model =
    div [ class "service-details" ]
        [ h2 [] [ text "Service Details" ]
        , case model.selectedService of
            Nothing ->
                div [ class "no-selection" ] 
                    [ text "Select a service to view details" ]
            
            Just serviceId ->
                let
                    maybeService =
                        model.services
                            |> List.filter (\s -> s.id == serviceId)
                            |> List.head
                in
                case maybeService of
                    Nothing ->
                        div [ class "error" ] [ text "Service not found" ]
                    
                    Just service ->
                        viewServiceDetail service model.serviceHealth model.loading
        ]

viewServiceDetail : Api.Service -> Maybe Api.ServiceHealth -> Bool -> Html Msg
viewServiceDetail service maybeHealth loading =
    div [ class "service-detail-card" ]
        [ div [ class "service-detail-header" ]
            [ h3 [] [ text service.name ]
            , div 
                [ class ("status-indicator " ++ statusClass service.status) 
                , title (statusText service.status)
                ] 
                []
            ]
        , div [ class "service-detail-content" ]
            [ div [ class "detail-item" ]
                [ span [ class "detail-label" ] [ text "ID:" ]
                , span [] [ text service.id ]
                ]
            , div [ class "detail-item" ]
                [ span [ class "detail-label" ] [ text "URL:" ]
                , a [ href service.url, target "_blank" ] [ text service.url ]
                ]
            , div [ class "detail-item" ]
                [ span [ class "detail-label" ] [ text "Description:" ]
                , span [] [ text service.description ]
                ]
            , div [ class "detail-item" ]
                [ span [ class "detail-label" ] [ text "Health Endpoint:" ]
                , span [] [ text (if service.hasHealthEndpoint then "Available" else "Not available") ]
                ]
            ]
        , div [ class "service-health" ]
            [ h4 [] [ text "Health Status" ]
            , if loading then
                div [ class "loading" ] [ text "Loading health data..." ]
              else
                viewHealthStatus maybeHealth
            ]
        , div [ class "service-actions" ]
            [ a 
                [ href service.url
                , target "_blank"
                , class "button"
                ] 
                [ text "Open Service" ]
            , if service.hasHealthEndpoint then
                button 
                    [ class "button"
                    , onClick (SelectService service.id)
                    ] 
                    [ text "Refresh Health" ]
              else
                text ""
            ]
        ]

viewHealthStatus : Maybe Api.ServiceHealth -> Html Msg
viewHealthStatus maybeHealth =
    case maybeHealth of
        Nothing ->
            div [ class "no-health-data" ] [ text "No health data available" ]
        
        Just health ->
            div [ class ("health-status " ++ healthStatusClass health.status) ]
                [ div [ class "health-status-indicator" ] []
                , div [ class "health-status-text" ] [ text (healthStatusText health.status) ]
                ]

-- HELPERS

statusClass : String -> String
statusClass status =
    case status of
        "available" -> "status-available"
        "degraded" -> "status-degraded"
        "unavailable" -> "status-unavailable"
        _ -> "status-unknown"

statusText : String -> String
statusText status =
    case status of
        "available" -> "Service is available"
        "degraded" -> "Service is experiencing issues"
        "unavailable" -> "Service is unavailable"
        _ -> "Status unknown"

healthStatusClass : String -> String
healthStatusClass status =
    case status of
        "healthy" -> "health-healthy"
        "unhealthy" -> "health-unhealthy"
        _ -> "health-unknown"

healthStatusText : String -> String
healthStatusText status =
    case status of
        "healthy" -> "Service is healthy"
        "unhealthy" -> "Service is unhealthy"
        _ -> "Health status unknown"

errorToString : Http.Error -> String
errorToString error =
    case error of
        Http.BadUrl url ->
            "Bad URL: " ++ url

        Http.Timeout ->
            "Request timed out"

        Http.NetworkError ->
            "Network error"

        Http.BadStatus status ->
            "Bad status: " ++ String.fromInt status

        Http.BadBody message ->
            "Bad body: " ++ message
