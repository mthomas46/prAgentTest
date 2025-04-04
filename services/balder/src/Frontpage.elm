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
      , services = defaultServices
      , tools = defaultTools
      , error = Nothing
      , navigationModel = Navigation.init
      }
    , Cmd.none
    )

defaultServices : List Service
defaultServices =
    [ { name = "Task Service"
      , description = "Core service for managing tasks and workflows"
      , url = "http://localhost:3000"
      , swaggerUrl = "http://localhost:3000/api-docs"
      , isAvailable = True
      }
    , { name = "Balder Service"
      , description = "Service discovery and API gateway"
      , url = "http://localhost:3002"
      , swaggerUrl = "http://localhost:3002/api-docs"
      , isAvailable = True
      }
    , { name = "Webhook Service"
      , description = "Handles webhook events and notifications"
      , url = "http://localhost:3003"
      , swaggerUrl = "http://localhost:3003/api-docs"
      , isAvailable = True
      }
    , { name = "Heimdal Service"
      , description = "Authentication and authorization service"
      , url = "http://localhost:3004"
      , swaggerUrl = "http://localhost:3004/api-docs"
      , isAvailable = True
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

-- UPDATE
type Msg
    = NoOp
    | Tick Time.Posix
    | NavigationMsg Navigation.Msg

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )
        
        Tick _ ->
            ( model, Cmd.none )
            
        NavigationMsg navMsg ->
            ( { model | navigationModel = Navigation.update navMsg model.navigationModel }
            , Cmd.none
            )

-- SUBSCRIPTIONS
subscriptions : Model -> Sub Msg
subscriptions _ =
    Time.every 5000 Tick

-- VIEW
view : Model -> Html Msg
view model =
    div []
        [ Html.map NavigationMsg (Navigation.view model.navigationModel)
        , div [ class "container mx-auto px-4 py-8" ]
            [ viewHeader model
            , viewServices model.services
            , viewTools model.tools
            ]
        ]

viewHeader : Model -> Html Msg
viewHeader model =
    div [ class "mb-8 text-center" ]
        [ h1 [ class "text-4xl font-bold text-gray-900 mb-2" ]
            [ text model.serviceName ]
        , p [ class "text-gray-600" ]
            [ text ("Version: " ++ model.version ++ " | Environment: " ++ model.environment) ]
        ]

viewServices : List Service -> Html Msg
viewServices services =
    div [ class "mb-12" ]
        [ h2 [ class "text-2xl font-bold text-gray-900 mb-6" ]
            [ text "Services" ]
        , div [ class "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6" ]
            (List.map viewServiceCard services)
        ]

viewTools : List Tool -> Html Msg
viewTools tools =
    div [ class "mb-12" ]
        [ h2 [ class "text-2xl font-bold text-gray-900 mb-6" ]
            [ text "Tools" ]
        , div [ class "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6" ]
            (List.map viewToolCard tools)
        ]

viewServiceCard : Service -> Html Msg
viewServiceCard service =
    div [ class "service-card" ]
        [ div [ class "flex justify-between items-start mb-4" ]
            [ h2 [ class "text-xl font-semibold text-gray-900" ]
                [ text service.name ]
            , if service.isAvailable then
                a [ href service.swaggerUrl
                  , target "_blank"
                  , class "text-blue-600 hover:text-blue-800"
                  ]
                  [ i [ class "fas fa-book mr-1" ] []
                  , text "API Docs"
                  ]
              else
                span [ class "text-gray-400" ]
                  [ i [ class "fas fa-book mr-1" ] []
                  , text "API Docs"
                  ]
            ]
        , p [ class "text-gray-600 mb-4" ]
            [ text service.description ]
        , div [ class "flex justify-between items-center" ]
            [ if service.isAvailable then
                a [ href service.url
                  , target "_blank"
                  , class "text-blue-600 hover:text-blue-800"
                  ]
                  [ i [ class "fas fa-external-link-alt mr-1" ] []
                  , text "Visit Service"
                  ]
              else
                span [ class "text-gray-400" ]
                  [ i [ class "fas fa-external-link-alt mr-1" ] []
                  , text "Visit Service"
                  ]
            ]
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