module Dashboard exposing (Model, Msg, init, subscriptions, update, view)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Http
import Json.Decode as Decode
import Time

-- MODEL

type alias Model =
    { services : List ServiceSummary
    , version : String
    , environment : String
    , lastUpdated : Maybe Time.Posix
    , loading : Bool
    , error : Maybe String
    }

type alias ServiceSummary =
    { name : String
    , status : String
    , url : String
    , description : String
    }

type alias Flags =
    { version : String
    , environment : String
    }

init : Flags -> ( Model, Cmd Msg )
init flags =
    ( { services = []
      , version = flags.version
      , environment = flags.environment
      , lastUpdated = Nothing
      , loading = True
      , error = Nothing
      }
    , fetchServices
    )

-- UPDATE

type Msg
    = GotServices (Result Http.Error (List ServiceSummary))
    | Tick Time.Posix
    | RefreshServices

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotServices result ->
            case result of
                Ok services ->
                    ( { model
                        | services = services
                        , loading = False
                        , lastUpdated = Just (Time.millisToPosix 0) -- This would be replaced with actual time in a real app
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

        Tick time ->
            ( { model | lastUpdated = Just time }
            , Cmd.none
            )

        RefreshServices ->
            ( { model | loading = True }
            , fetchServices
            )

-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions _ =
    Time.every 30000 Tick

-- VIEW

view : Model -> Html Msg
view model =
    div [ class "dashboard" ]
        [ div [ class "dashboard-header" ]
            [ h1 [] [ text "Balder Service Dashboard" ]
            , p [ class "description" ] [ text "Service discovery and API gateway for your microservices architecture" ]
            ]
        , viewSystemStatus model
        , viewServicesList model
        ]

viewSystemStatus : Model -> Html Msg
viewSystemStatus model =
    div [ class "system-status" ]
        [ div [ class "card status-card" ]
            [ h2 [] [ text "System Status" ]
            , div [ class "status-details" ]
                [ div [ class "status-item" ]
                    [ span [ class "status-label" ] [ text "Environment:" ]
                    , span [ class "status-value" ] [ text model.environment ]
                    ]
                , div [ class "status-item" ]
                    [ span [ class "status-label" ] [ text "Version:" ]
                    , span [ class "status-value" ] [ text model.version ]
                    ]
                , div [ class "status-item" ]
                    [ span [ class "status-label" ] [ text "Last Updated:" ]
                    , span [ class "status-value" ] 
                        [ text (model.lastUpdated 
                            |> Maybe.map (\t -> "Just now") -- This would be formatted in a real app
                            |> Maybe.withDefault "Never"
                          ) 
                        ]
                    ]
                ]
            , button 
                [ class "refresh-button"
                , onClick RefreshServices
                ] 
                [ text "Refresh" ]
            ]
        ]

viewServicesList : Model -> Html Msg
viewServicesList model =
    div [ class "services-list" ]
        [ h2 [] [ text "Services" ]
        , if model.loading then
            div [ class "loading" ] [ text "Loading services..." ]
          else if List.isEmpty model.services then
            div [ class "no-services" ] [ text "No services available" ]
          else
            div [ class "services-grid" ]
                (List.map viewServiceCard model.services)
        ]

viewServiceCard : ServiceSummary -> Html Msg
viewServiceCard service =
    div [ class "card service-card" ]
        [ div [ class "service-header" ]
            [ h3 [ class "service-title" ] [ text service.name ]
            , div 
                [ class ("status-indicator " ++ statusClass service.status) 
                , title (statusText service.status)
                ] 
                []
            ]
        , p [ class "service-description" ] [ text service.description ]
        , div [ class "service-footer" ]
            [ a 
                [ href service.url
                , target "_blank"
                , class "service-link"
                ] 
                [ text "Open Service" ]
            ]
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

-- HTTP

fetchServices : Cmd Msg
fetchServices =
    Http.get
        { url = "/api/services"
        , expect = Http.expectJson GotServices servicesDecoder
        }

servicesDecoder : Decode.Decoder (List ServiceSummary)
servicesDecoder =
    Decode.list
        (Decode.map4 ServiceSummary
            (Decode.field "name" Decode.string)
            (Decode.field "status" Decode.string)
            (Decode.field "url" Decode.string)
            (Decode.field "description" Decode.string)
        )

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
