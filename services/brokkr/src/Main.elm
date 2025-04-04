module Main exposing (..)

import Browser
import Frontpage
import Html exposing (..)
import Time


main : Program () Frontpage.Model Frontpage.Msg
main =
    Browser.element
        { init = \_ -> Frontpage.init "Brokkr"
        , view = Frontpage.view
        , update = Frontpage.update
        , subscriptions = \_ -> Time.every 5000 Frontpage.Tick
        } 