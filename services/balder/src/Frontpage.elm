module Frontpage exposing (main)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Decode as D
import Time exposing (Posix)
import Navigation

-- MAIN
main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }

-- MODEL
type alias Flags =
    { serviceName : String
    , version : String
    , environment : String
    }

type alias Model =
    { serviceName : String
    , version : String
    , environment : String
    , services : List Service
    , tools : List Tool
    , error : Maybe String
    , navigationModel : Navigation.Model
    }

type alias Service =
    { name : String
    , description : String
    , url : String
    , swaggerUrl : String
    , isAvailable : Bool
    , hasHealthEndpoint : Bool
    , version : Maybe String
    }

type alias Tool =
    { name : String
    , description : String
    , url : String
    , isAvailable : Bool
    }

init : Flags -> ( Model, Cmd Msg )
init flags =
    ( { serviceName = flags.serviceName
      , version = flags.version
      , environment = flags.environment
      , services = initialServices
      , tools = defaultTools
      , error = Nothing
      , navigationModel = Navigation.init
      }
    , checkAllServices initialServices
    )

-- UPDATE
type Msg
    = NoOp
    | Tick Time.Posix
    | NavigationMsg Navigation.Msg
    | ServiceHealthCheck String Bool
    | ServiceHealthCheckError String
    | AllServicesHealthCheck (Result Http.Error AllServicesHealth)
    | ServiceVersionCheck String (Maybe String)

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )
        
        Tick _ ->
            ( model, checkAllServicesHealth )
            
        NavigationMsg navMsg ->
            ( { model | navigationModel = Navigation.update navMsg model.navigationModel }
            , Cmd.none
            )

        ServiceHealthCheck serviceName isAvailable ->
            let
                updateService service =
                    if service.name == serviceName then
                        { service | isAvailable = isAvailable }
                    else
                        service
                
                updatedServices = List.map updateService model.services
            in
            ( { model | services = updatedServices }
            , Cmd.none
            )

        ServiceHealthCheckError serviceName ->
            let
                updateService service =
                    if service.name == serviceName then
                        { service | isAvailable = False }
                    else
                        service
                
                updatedServices = List.map updateService model.services
            in
            ( { model | services = updatedServices }
            , Cmd.none
            )

        ServiceVersionCheck serviceName version ->
            let
                updateService service =
                    if service.name == serviceName then
                        { service | version = version }
                    else
                        service
                
                updatedServices = List.map updateService model.services
            in
            ( { model | services = updatedServices }
            , Cmd.none
            )

        AllServicesHealthCheck result ->
            case result of
                Ok healthData ->
                    let
                        updateService service =
                            case List.filter (\h -> h.name == service.name) healthData.services of
                                [health] ->
                                    { service | isAvailable = health.status == "healthy" }
                                _ ->
                                    service
                        
                        updatedServices = List.map updateService model.services
                    in
                    ( { model | services = updatedServices }
                    , Cmd.none
                    )
                
                Err _ ->
                    -- If Heimdal's health check fails, fall back to individual service checks
                    ( model, checkAllServices model.services )

-- SUBSCRIPTIONS
subscriptions : Model -> Sub Msg
subscriptions _ =
    Time.every 5000 Tick

-- HEALTH CHECKS
checkAllServicesHealth : Cmd Msg
checkAllServicesHealth =
    Http.get
        { url = "http://localhost:3003/heimdal/services/health"
        , expect = Http.expectJson AllServicesHealthCheck allServicesHealthDecoder
        }

type alias HealthResponse =
    { status : String
    , timestamp : String
    , uptime : Float
    , version : Maybe String
    }

type alias ServiceHealth =
    { name : String
    , status : String
    , response : HealthResponse
    , version : Maybe String
    }

type alias AllServicesHealth =
    { status : String
    , services : List ServiceHealth
    }

healthResponseDecoder : D.Decoder HealthResponse
healthResponseDecoder =
    D.map4 HealthResponse
        (D.field "status" D.string)
        (D.field "timestamp" D.string)
        (D.field "uptime" D.float)
        (D.maybe (D.field "version" D.string))

serviceHealthDecoder : D.Decoder ServiceHealth
serviceHealthDecoder =
    D.map4 ServiceHealth
        (D.field "name" D.string)
        (D.field "status" D.string)
        (D.field "response" healthResponseDecoder)
        (D.maybe (D.field "version" D.string))

allServicesHealthDecoder : D.Decoder AllServicesHealth
allServicesHealthDecoder =
    D.map2 AllServicesHealth
        (D.field "status" D.string)
        (D.field "services" (D.list serviceHealthDecoder))

checkAllServices : List Service -> Cmd Msg
checkAllServices serviceList =
    Cmd.batch (List.map checkServiceHealth serviceList)

checkServiceHealth : Service -> Cmd Msg
checkServiceHealth service =
    if service.hasHealthEndpoint then
        let
            healthEndpoint = 
                case service.name of
                    "Heimdal Service" ->
                        "/heimdal/health"
                    "Loki" ->
                        "/health"
                    _ ->
                        "/health"
        in
        Http.get
            { url = service.url ++ healthEndpoint
            , expect = Http.expectJson (handleHealthResponse service.name) healthResponseDecoder
            }
    else
        -- For services without health endpoints, try to get version info
        Http.get
            { url = service.url ++ "/version"
            , expect = Http.expectJson (handleVersionResponse service.name) versionResponseDecoder
            }

versionResponseDecoder : D.Decoder HealthResponse
versionResponseDecoder =
    D.map4 HealthResponse
        (D.succeed "ok")
        (D.succeed (Time.toIsoString (Time.millisToPosix 0)))
        (D.succeed 0)
        (D.maybe (D.field "version" D.string))

handleVersionResponse : String -> Result Http.Error HealthResponse -> Msg
handleVersionResponse serviceName result =
    case result of
        Ok response ->
            ServiceVersionCheck serviceName response.version
        
        Err _ ->
            ServiceVersionCheck serviceName Nothing

handleHealthResponse : String -> Result Http.Error HealthResponse -> Msg
handleHealthResponse serviceName result =
    case result of
        Ok response ->
            ServiceHealthCheck serviceName (response.status == "ok")

        Err _ ->
            -- Try a basic connection check before marking as unavailable
            Http.get
                { url = serviceName
                , expect = Http.expectWhatever (handleBasicResponse serviceName)
                }
            ServiceHealthCheck serviceName False

initialServices : List Service
initialServices =
    [ { name = "Task Service"
      , url = "http://localhost:3000"
      , swaggerUrl = "http://localhost:3000/swagger-ui.html"
      , description = "Core service for managing tasks and workflows"
      , isAvailable = True
      , hasHealthEndpoint = True
      , version = Just "1.0.0"
      }
    , { name = "Balder Service"
      , url = "http://localhost:3002"
      , swaggerUrl = "http://localhost:3002/swagger-ui.html"
      , description = "Service discovery and API gateway"
      , isAvailable = True
      , hasHealthEndpoint = True
      , version = Just "2.0.0"
      }
    , { name = "Webhook Service"
      , url = "http://localhost:3004"
      , swaggerUrl = "http://localhost:3004/swagger-ui.html"
      , description = "Handles webhook events and notifications"
      , isAvailable = True
      , hasHealthEndpoint = True
      , version = Just "1.0.0"
      }
    , { name = "Heimdal Service"
      , url = "http://localhost:3003"
      , swaggerUrl = "http://localhost:3003/api"
      , description = "Authentication and authorization service"
      , isAvailable = True
      , hasHealthEndpoint = True
      , version = Just "3.0.0"
      }
    , { name = "Bifrost Service"
      , url = "http://localhost:3005"
      , swaggerUrl = "http://localhost:3005/swagger-ui.html"
      , description = "Integration and data transformation service"
      , isAvailable = True
      , hasHealthEndpoint = False
      , version = Nothing
      }
    , { name = "Brokkr Service"
      , url = "http://localhost:3006"
      , swaggerUrl = "http://localhost:3006/swagger-ui.html"
      , description = "Document processing and workflow automation"
      , isAvailable = True
      , hasHealthEndpoint = False
      , version = Nothing
      }
    , { name = "Prometheus"
      , url = "http://localhost:9090"
      , swaggerUrl = "http://localhost:9090/graph"
      , description = "Metrics collection and monitoring"
      , isAvailable = True
      , hasHealthEndpoint = True
      , version = Just "2.0.0"
      }
    , { name = "Grafana"
      , url = "http://localhost:3001"
      , swaggerUrl = "http://localhost:3001/api-docs"
      , description = "Visualization and analytics dashboard"
      , isAvailable = True
      , hasHealthEndpoint = True
      , version = Just "1.0.0"
      }
    , { name = "Kibana"
      , url = "http://localhost:5601"
      , swaggerUrl = "http://localhost:5601/app/dev_tools#/console"
      , description = "Log visualization and analysis"
      , isAvailable = True
      , hasHealthEndpoint = True
      , version = Just "1.0.0"
      }
    , { name = "Elasticsearch"
      , url = "http://localhost:9200"
      , swaggerUrl = "http://localhost:9200/_cat/indices?v"
      , description = "Search and analytics engine"
      , isAvailable = True
      , hasHealthEndpoint = True
      , version = Just "7.0.0"
      }
    , { name = "Logstash"
      , url = "http://localhost:9600"
      , swaggerUrl = "http://localhost:9600/_node"
      , description = "Log processing and pipeline"
      , isAvailable = True
      , hasHealthEndpoint = True
      , version = Just "2.0.0"
      }
    , { name = "Loki"
      , url = "http://localhost:3100"
      , swaggerUrl = "http://localhost:3100/metrics"
      , description = "Log aggregation system designed for high-volume data"
      , isAvailable = True
      , hasHealthEndpoint = True
      , version = Just "2.0.0"
      }
    , { name = "Node Exporter"
      , url = "http://localhost:9100"
      , swaggerUrl = "http://localhost:9100/metrics"
      , description = "System metrics collection"
      , isAvailable = True
      , hasHealthEndpoint = True
      , version = Just "1.0.0"
      }
    , { name = "AvettaDocAgent"
      , url = "http://localhost:3009"
      , swaggerUrl = "http://localhost:3009/swagger-ui.html"
      , description = "Document processing and management"
      , isAvailable = True
      , hasHealthEndpoint = False
      , version = Nothing
      }
    ]

defaultTools : List Tool
defaultTools =
    [ { name = "Prometheus"
      , description = "Metrics collection and monitoring"
      , url = "http://localhost:9090"
      , isAvailable = True
      }
    , { name = "Grafana"
      , description = "Visualization and analytics dashboard"
      , url = "http://localhost:3001"
      , isAvailable = True
      }
    , { name = "Kibana"
      , description = "Log visualization and analysis"
      , url = "http://localhost:5601"
      , isAvailable = True
      }
    , { name = "Elasticsearch"
      , description = "Search and analytics engine"
      , url = "http://localhost:9200"
      , isAvailable = True
      }
    , { name = "Logstash"
      , description = "Log processing and pipeline"
      , url = "http://localhost:9600"
      , isAvailable = True
      }
    , { name = "Node Exporter"
      , description = "System metrics collection"
      , url = "http://localhost:9100"
      , isAvailable = True
      }
    , { name = "AvettaDocAgent"
      , description = "Document processing and management"
      , url = "http://localhost:3009"
      , isAvailable = True
      }
    ]

-- VIEW
view : Model -> Html Msg
view model =
    div [ Html.Attributes.class "min-h-screen bg-gray-50 flex flex-col" ]
        [ Html.map NavigationMsg (Navigation.view model.navigationModel)
        , main_ [ Html.Attributes.class "flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" ]
            [ div [ Html.Attributes.class "bg-white rounded-lg shadow-lg p-6 mb-8" ]
                [ h1 [ Html.Attributes.class "text-3xl font-bold text-gray-900 mb-4" ] [ text "Welcome to the Microservices Platform" ]
                , p [ Html.Attributes.class "text-lg text-gray-600 mb-6" ] [ text "A comprehensive suite of services for managing your microservices architecture." ]
                , div [ Html.Attributes.class "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" ]
                    (List.map viewServiceCard model.services)
                ]
            ]
        ]

viewServiceCard : Service -> Html Msg
viewServiceCard service =
    div [ Html.Attributes.class "bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100 flex flex-col" ]
        [ div [ Html.Attributes.class "p-6 flex-1 flex flex-col" ]
            [ div [ Html.Attributes.class "flex items-center justify-between mb-4" ]
                [ div [ Html.Attributes.class "flex items-center space-x-2" ]
                    [ h2 [ Html.Attributes.class "text-xl font-semibold text-gray-900" ] [ text service.name ]
                    , viewStatusIndicator service.isAvailable
                    ]
                , case service.version of
                    Just v ->
                        span [ Html.Attributes.class "text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded" ]
                            [ text ("v" ++ v) ]
                    Nothing ->
                        text ""
                ]
            , p [ Html.Attributes.class "text-gray-600 mb-4 flex-1" ] [ text service.description ]
            , div [ Html.Attributes.class "flex flex-col space-y-2" ]
                [ a
                    [ href service.url
                    , Html.Attributes.class "inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                    ]
                    [ text "Visit Service" ]
                , a
                    [ href service.swaggerUrl
                    , Html.Attributes.class "inline-flex items-center justify-center px-4 py-2 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-200"
                    ]
                    [ text "API Documentation" ]
                ]
            , div [ Html.Attributes.class "mt-4 pt-4 border-t border-gray-100" ]
                [ div [ Html.Attributes.class "mt-2" ] [ viewStatusText service.isAvailable ]
                ]
            ]
        ]

viewStatusIndicator : Bool -> Html msg
viewStatusIndicator isAvailable =
    let
        (color, tooltip) =
            if isAvailable then
                ("text-green-500", "Service is available")
            else
                ("text-red-500", "Service is unavailable")
    in
    span [ Html.Attributes.class ("text-sm " ++ color), title tooltip ]
        [ text "•" ]

viewStatusText : Bool -> Html msg
viewStatusText isAvailable =
    let
        (statusText, color) =
            if isAvailable then
                ("Service is available", "text-green-600")
            else
                ("Service is unavailable", "text-red-600")
    in
    span [ Html.Attributes.class ("text-sm font-medium " ++ color) ] [ text statusText ]

viewTools : List Tool -> Html Msg
viewTools tools =
    div [ class "mb-12" ]
        [ h2 [ class "text-2xl font-bold text-gray-900 mb-6" ]
            [ text "Tools" ]
        , div [ class "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6" ]
            (List.map viewToolCard tools)
        ]

viewToolCard : Tool -> Html Msg
viewToolCard tool =
    div [ class "service-card" ]
        [ div [ class "flex justify-between items-start mb-4" ]
            [ h2 [ class "text-xl font-semibold text-gray-900" ]
                [ text tool.name ]
            ]
        , p [ class "text-gray-600 mb-4" ]
            [ text tool.description ]
        , div [ class "flex justify-between items-center" ]
            [ if tool.isAvailable then
                a [ href tool.url
                  , target "_blank"
                  , class "text-blue-600 hover:text-blue-800"
                  ]
                  [ i [ class "fas fa-external-link-alt mr-1" ] []
                  , text "Visit Tool"
                  ]
              else
                span [ class "text-gray-400" ]
                  [ i [ class "fas fa-external-link-alt mr-1" ] []
                  , text "Visit Tool"
                  ]
            ]
        ] 