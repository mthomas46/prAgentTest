module Main exposing (main)

import Browser
import Html exposing (Html, div, text)

main =
    Browser.sandbox { init = init, update = update, view = view }

type alias Model =
    { message : String }

init : Model
init =
    { message = "Welcome to Balder Service!" }

type Msg
    = NoOp

update : Msg -> Model -> Model
update msg model =
    model

view : Model -> Html Msg
view model =
    div [] [ text model.message ] 