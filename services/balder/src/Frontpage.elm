module Frontpage exposing (main)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Decode as D
import Time exposing (Posix)

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
    , error : Maybe String
    }

type alias Service =
    { name : String
    , description : String
    , url : String
    , swaggerUrl : String
    , isAvailable : Bool
    }

init : Flags -> ( Model, Cmd Msg )
init flags =
    ( { serviceName = flags.serviceName
      , version = flags.version
      , environment = flags.environment
      , services = defaultServices
      , error = Nothing
      }
    , Cmd.none
    )

defaultServices : List Service
defaultServices =
    [ { name = "Task Service"
      , description = "Manages tasks and their lifecycle"
      , url = "http://localhost:3000"
      , swaggerUrl = "http://localhost:3000/api"
      , isAvailable = True
      }
    , { name = "Balder Service"
      , description = "Frontend service with service directory"
      , url = "http://localhost:3002"
      , swaggerUrl = "http://localhost:3002/api-docs"
      , isAvailable = True
      }
    , { name = "Webhook Service"
      , description = "Handles webhook events and notifications"
      , url = "http://localhost:3003"
      , swaggerUrl = "http://localhost:3003"
      , isAvailable = True
      }
    , { name = "Heimdal Service"
      , description = "Authentication and authorization service (Coming soon)"
      , url = "#"
      , swaggerUrl = "#"
      , isAvailable = False
      }
    ]

-- UPDATE
type Msg
    = NoOp
    | Tick Time.Posix

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )
        
        Tick _ ->
            ( model, Cmd.none )

-- SUBSCRIPTIONS
subscriptions : Model -> Sub Msg
subscriptions _ =
    Time.every 5000 Tick

-- VIEW
view : Model -> Html Msg
view model =
    div [ class "container mx-auto px-4 py-8" ]
        [ viewHeader model
        , viewServices model.services
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
    div [ class "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6" ]
        (List.map viewServiceCard services)

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