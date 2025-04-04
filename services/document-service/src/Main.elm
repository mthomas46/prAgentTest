module Main exposing (main)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)

type alias Model =
    { title : String
    , description : String
    }

init : () -> ( Model, Cmd Msg )
init _ =
    ( { title = "Document Service"
      , description = "Service for managing document processing, storage, and retrieval across the microservices architecture"
      }
    , Cmd.none
    )

type Msg
    = NoOp

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

view : Model -> Browser.Document Msg
view model =
    { title = model.title
    , body =
        [ div [ class "container mx-auto px-4 py-8" ]
            [ h1 [ class "text-4xl font-bold mb-4" ] [ text model.title ]
            , p [ class "text-lg text-gray-600" ] [ text model.description ]
            ]
        ]
    }

main : Program () Model Msg
main =
    Browser.document
        { init = init
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        } 