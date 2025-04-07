module Route exposing (Route, fromUrl)

import Url
import Url.Parser as Parser exposing (Parser, oneOf, s)

type Route
    = Dashboard
    | ServiceList
    | TaskList
    | NotFound

fromUrl : Url.Url -> Route
fromUrl url =
    { url | path = Maybe.withDefault "" url.fragment, fragment = Nothing }
        |> Parser.parse parser
        |> Maybe.withDefault NotFound

parser : Parser (Route -> a) a
parser =
    oneOf
        [ Parser.map Dashboard Parser.top
        , Parser.map Dashboard (s "dashboard")
        , Parser.map ServiceList (s "services")
        , Parser.map TaskList (s "tasks")
        ]
