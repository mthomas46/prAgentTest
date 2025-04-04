module Frontpage exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Decode as Decode
import Time


type alias ServiceInfo =
    { name : String
    , version : String
    , status : String
    , timestamp : String
    , uptime : Float
    }


type alias Model =
    { serviceInfo : Maybe ServiceInfo
    , error : Maybe String
    }


type Msg
    = GotServiceInfo (Result Http.Error ServiceInfo)
    | Tick Time.Posix


init : String -> ( Model, Cmd Msg )
init serviceName =
    ( { serviceInfo = Nothing, error = Nothing }
    , getServiceInfo serviceName
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotServiceInfo result ->
            case result of
                Ok info ->
                    ( { model | serviceInfo = Just info, error = Nothing }
                    , Cmd.none
                    )

                Err _ ->
                    ( { model | error = Just "Failed to fetch service info" }
                    , Cmd.none
                    )

        Tick _ ->
            ( model
            , getServiceInfo (model.serviceInfo |> Maybe.map .name |> Maybe.withDefault "")
            )


view : Model -> Html Msg
view model =
    div [ class "min-h-screen bg-gray-100" ]
        [ div [ class "max-w-7xl mx-auto py-6 sm:px-6 lg:px-8" ]
            [ div [ class "px-4 py-6 sm:px-0" ]
                [ div [ class "bg-white overflow-hidden shadow rounded-lg" ]
                    [ div [ class "px-4 py-5 sm:p-6" ]
                        [ h1 [ class "text-2xl font-bold text-gray-900 mb-4" ]
                            [ text "Service Dashboard" ]
                        , case model.serviceInfo of
                            Just info ->
                                viewServiceInfo info

                            Nothing ->
                                case model.error of
                                    Just error ->
                                        div [ class "text-red-600" ] [ text error ]

                                    Nothing ->
                                        div [ class "text-gray-600" ] [ text "Loading..." ]
                        , viewLinks
                        ]
                    ]
                ]
            ]
        ]


viewServiceInfo : ServiceInfo -> Html Msg
viewServiceInfo info =
    div [ class "space-y-4" ]
        [ div [ class "grid grid-cols-2 gap-4" ]
            [ div []
                [ h2 [ class "text-lg font-medium text-gray-900" ] [ text "Service Information" ]
                , dl [ class "mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2" ]
                    [ div [ class "px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6" ]
                        [ dt [ class "text-sm font-medium text-gray-500 truncate" ] [ text "Name" ]
                        , dd [ class "mt-1 text-3xl font-semibold text-gray-900" ] [ text info.name ]
                        ]
                    , div [ class "px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6" ]
                        [ dt [ class "text-sm font-medium text-gray-500 truncate" ] [ text "Version" ]
                        , dd [ class "mt-1 text-3xl font-semibold text-gray-900" ] [ text info.version ]
                        ]
                    ]
                ]
            , div []
                [ h2 [ class "text-lg font-medium text-gray-900" ] [ text "Health Status" ]
                , dl [ class "mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2" ]
                    [ div [ class "px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6" ]
                        [ dt [ class "text-sm font-medium text-gray-500 truncate" ] [ text "Status" ]
                        , dd [ class "mt-1 text-3xl font-semibold text-green-600" ] [ text info.status ]
                        ]
                    , div [ class "px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6" ]
                        [ dt [ class "text-sm font-medium text-gray-500 truncate" ] [ text "Uptime" ]
                        , dd [ class "mt-1 text-3xl font-semibold text-gray-900" ] [ text (String.fromFloat info.uptime ++ "s") ]
                        ]
                    ]
                ]
            ]
        ]


viewLinks : Html Msg
viewLinks =
    div [ class "mt-8" ]
        [ h2 [ class "text-lg font-medium text-gray-900 mb-4" ] [ text "Quick Links" ]
        , div [ class "grid grid-cols-1 gap-4 sm:grid-cols-2" ]
            [ a
                [ href "/api-docs"
                , class "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                ]
                [ text "Swagger Documentation" ]
            , a
                [ href "/"
                , class "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                ]
                [ text "Main Application" ]
            ]
        ]


getServiceInfo : String -> Cmd Msg
getServiceInfo serviceName =
    Http.get
        { url = "/health"
        , expect = Http.expectJson GotServiceInfo serviceInfoDecoder
        }


serviceInfoDecoder : Decode.Decoder ServiceInfo
serviceInfoDecoder =
    Decode.map5 ServiceInfo
        (Decode.field "name" Decode.string)
        (Decode.field "version" Decode.string)
        (Decode.field "status" Decode.string)
        (Decode.field "timestamp" Decode.string)
        (Decode.field "uptime" Decode.float) 