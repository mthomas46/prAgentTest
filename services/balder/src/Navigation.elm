module Navigation exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Svg exposing (svg, path)
import Svg.Attributes exposing (class, fill, viewBox, stroke, strokeLinecap, strokeLinejoin, strokeWidth, d)


type alias Service =
    { name : String
    , url : String
    , swaggerUrl : String
    }


type alias Model =
    { isMobileMenuOpen : Bool
    }


type Msg
    = ToggleMobileMenu


init : Model
init =
    { isMobileMenuOpen = False
    }


update : Msg -> Model -> Model
update msg model =
    case msg of
        ToggleMobileMenu ->
            { model | isMobileMenuOpen = not model.isMobileMenuOpen }


services : List Service
services =
    [ { name = "Task Service"
      , url = "http://localhost:3000"
      , swaggerUrl = "http://localhost:3000/api-docs"
      }
    , { name = "Balder Service"
      , url = "http://localhost:3002"
      , swaggerUrl = "http://localhost:3002/api-docs"
      }
    , { name = "Webhook Service"
      , url = "http://localhost:3003"
      , swaggerUrl = "http://localhost:3003/api-docs"
      }
    , { name = "Heimdal Service"
      , url = "http://localhost:3004"
      , swaggerUrl = "http://localhost:3004/api-docs"
      }
    ]


view : Model -> Html Msg
view model =
    nav [ Html.Attributes.class "bg-white shadow" ]
        [ div [ Html.Attributes.class "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ]
            [ div [ Html.Attributes.class "flex justify-between h-16" ]
                [ div [ Html.Attributes.class "flex" ]
                    [ div [ Html.Attributes.class "flex-shrink-0 flex items-center" ]
                        [ span [ Html.Attributes.class "text-xl font-bold text-indigo-600" ] [ text "Microservices Platform" ] ]
                    , div [ Html.Attributes.class "hidden sm:ml-6 sm:flex sm:space-x-8" ]
                        (List.map viewServiceLink services)
                    ]
                , div [ Html.Attributes.class "hidden sm:ml-6 sm:flex sm:items-center" ]
                    [ div [ Html.Attributes.class "flex space-x-4" ]
                        (List.map viewSwaggerLink services)
                    ]
                , div [ Html.Attributes.class "flex items-center sm:hidden" ]
                    [ button
                        [ type_ "button"
                        , Html.Attributes.class "inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        , onClick ToggleMobileMenu
                        ]
                        [ span [ Html.Attributes.class "sr-only" ] [ text "Open main menu" ]
                        , if model.isMobileMenuOpen then
                            viewCloseIcon
                          else
                            viewHamburgerIcon
                        ]
                    ]
                ]
            , if model.isMobileMenuOpen then
                viewMobileMenu
              else
                text ""
            ]
        ]


viewHamburgerIcon : Html msg
viewHamburgerIcon =
    svg [ Svg.Attributes.class "block h-6 w-6", fill "none", viewBox "0 0 24 24", stroke "currentColor" ]
        [ path [ strokeLinecap "round", strokeLinejoin "round", strokeWidth "2", d "M4 6h16M4 12h16M4 18h16" ] [] ]


viewCloseIcon : Html msg
viewCloseIcon =
    svg [ Svg.Attributes.class "block h-6 w-6", fill "none", viewBox "0 0 24 24", stroke "currentColor" ]
        [ path [ strokeLinecap "round", strokeLinejoin "round", strokeWidth "2", d "M6 18L18 6M6 6l12 12" ] [] ]


viewMobileMenu : Html msg
viewMobileMenu =
    div [ Html.Attributes.class "sm:hidden" ]
        [ div [ Html.Attributes.class "pt-2 pb-3 space-y-1" ]
            (List.map viewMobileServiceLink services)
        , div [ Html.Attributes.class "pt-4 pb-3 border-t border-gray-200" ]
            [ div [ Html.Attributes.class "space-y-1" ]
                (List.map viewMobileSwaggerLink services)
            ]
        ]


viewServiceLink : Service -> Html msg
viewServiceLink service =
    a
        [ href service.url
        , Html.Attributes.class "inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
        ]
        [ text service.name ]


viewSwaggerLink : Service -> Html msg
viewSwaggerLink service =
    a
        [ href service.swaggerUrl
        , Html.Attributes.class "inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
        ]
        [ text ("API Docs" ++ " - " ++ service.name) ]


viewMobileServiceLink : Service -> Html msg
viewMobileServiceLink service =
    a
        [ href service.url
        , Html.Attributes.class "block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300"
        ]
        [ text service.name ]


viewMobileSwaggerLink : Service -> Html msg
viewMobileSwaggerLink service =
    a
        [ href service.swaggerUrl
        , Html.Attributes.class "block pl-3 pr-4 py-2 text-base font-medium text-indigo-700 hover:text-indigo-800 hover:bg-indigo-50"
        ]
        [ text ("API Docs" ++ " - " ++ service.name) ] 