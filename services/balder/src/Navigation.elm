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
    , description : String
    , category : String
    , status : String
    , hasHealthEndpoint : Bool
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
      , description = "Core service for managing tasks and workflows"
      , category = "Core Services"
      , status = "healthy"
      , hasHealthEndpoint = True
      }
    , { name = "Balder Service"
      , url = "http://localhost:3002"
      , swaggerUrl = "http://localhost:3002/api-docs"
      , description = "Service discovery and API gateway"
      , category = "Core Services"
      , status = "healthy"
      , hasHealthEndpoint = True
      }
    , { name = "Webhook Service"
      , url = "http://localhost:3004"
      , swaggerUrl = "http://localhost:3004/api-docs"
      , description = "Handles webhook events and notifications"
      , category = "Core Services"
      , status = "healthy"
      , hasHealthEndpoint = True
      }
    , { name = "Heimdal Service"
      , url = "http://localhost:3003"
      , swaggerUrl = "http://localhost:3003/api-docs"
      , description = "Authentication and authorization service"
      , category = "Core Services"
      , status = "healthy"
      , hasHealthEndpoint = True
      }
    , { name = "Bifrost Service"
      , url = "http://localhost:3005"
      , swaggerUrl = "http://localhost:3005/api-docs"
      , description = "Integration and data transformation service"
      , category = "Core Services"
      , status = "healthy"
      , hasHealthEndpoint = False
      }
    , { name = "Brokkr Service"
      , url = "http://localhost:3006"
      , swaggerUrl = "http://localhost:3006/api-docs"
      , description = "Document processing and workflow automation"
      , category = "Core Services"
      , status = "healthy"
      , hasHealthEndpoint = False
      }
    , { name = "Prometheus"
      , url = "http://localhost:9090"
      , swaggerUrl = "http://localhost:9090/api/v1/status/config"
      , description = "Metrics collection and monitoring"
      , category = "Monitoring"
      , status = "healthy"
      , hasHealthEndpoint = True
      }
    , { name = "Grafana"
      , url = "http://localhost:3001"
      , swaggerUrl = "http://localhost:3001/api-docs"
      , description = "Visualization and analytics dashboard"
      , category = "Monitoring"
      , status = "healthy"
      , hasHealthEndpoint = True
      }
    , { name = "Kibana"
      , url = "http://localhost:5601"
      , swaggerUrl = "http://localhost:5601/api/status"
      , description = "Log visualization and analysis"
      , category = "Monitoring"
      , status = "healthy"
      , hasHealthEndpoint = True
      }
    , { name = "Elasticsearch"
      , url = "http://localhost:9200"
      , swaggerUrl = "http://localhost:9200/_cat/indices?v"
      , description = "Search and analytics engine"
      , category = "Monitoring"
      , status = "healthy"
      , hasHealthEndpoint = True
      }
    , { name = "Logstash"
      , url = "http://localhost:9600"
      , swaggerUrl = "http://localhost:9600/_node"
      , description = "Log processing and pipeline"
      , category = "Monitoring"
      , status = "healthy"
      , hasHealthEndpoint = True
      }
    , { name = "Loki"
      , url = "http://localhost:3100"
      , swaggerUrl = "http://localhost:3100/metrics"
      , description = "Log aggregation system designed for high-volume data"
      , category = "Monitoring"
      , status = "healthy"
      , hasHealthEndpoint = True
      }
    , { name = "Node Exporter"
      , url = "http://localhost:9100"
      , swaggerUrl = "http://localhost:9100/metrics"
      , description = "System metrics collection"
      , category = "Monitoring"
      , status = "healthy"
      , hasHealthEndpoint = True
      }
    , { name = "AvettaDocAgent"
      , url = "http://localhost:3009"
      , swaggerUrl = "http://localhost:3009/api-docs"
      , description = "Document processing and management"
      , category = "Tools"
      , status = "healthy"
      , hasHealthEndpoint = False
      }
    ]


view : Model -> Html Msg
view model =
    nav [ Html.Attributes.class "bg-white shadow-lg sticky top-0 z-50" ]
        [ div [ Html.Attributes.class "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ]
            [ div [ Html.Attributes.class "flex justify-between items-center h-16" ]
                [ div [ Html.Attributes.class "flex-shrink-0" ]
                    [ span [ Html.Attributes.class "text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent" ] 
                        [ text "Microservices Platform" ] 
                    ]
                , div [ Html.Attributes.class "hidden md:flex md:items-center md:space-x-8" ]
                    [ div [ Html.Attributes.class "flex space-x-4" ]
                        (List.filter (\s -> s.category == "Core Services") services |> List.map viewServiceLink)
                    , div [ Html.Attributes.class "flex space-x-4" ]
                        (List.filter (\s -> s.category == "Monitoring") services |> List.map viewServiceLink)
                    , div [ Html.Attributes.class "flex space-x-4" ]
                        (List.filter (\s -> s.category == "Tools") services |> List.map viewServiceLink)
                    ]
                , div [ Html.Attributes.class "flex items-center md:hidden" ]
                    [ button
                        [ type_ "button"
                        , Html.Attributes.class "inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors duration-200"
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
            ]
        , if model.isMobileMenuOpen then
            viewMobileMenu
          else
            text ""
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
    div [ Html.Attributes.class "md:hidden bg-white border-t border-gray-200 shadow-lg" ]
        [ div [ Html.Attributes.class "px-2 pt-2 pb-3 space-y-1" ]
            [ div [ Html.Attributes.class "px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider" ]
                [ text "Core Services" ]
            , div [] (List.filter (\s -> s.category == "Core Services") services |> List.map viewMobileServiceLink)
            , div [ Html.Attributes.class "mt-6 px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider" ]
                [ text "Monitoring" ]
            , div [] (List.filter (\s -> s.category == "Monitoring") services |> List.map viewMobileServiceLink)
            , div [ Html.Attributes.class "mt-6 px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider" ]
                [ text "Tools" ]
            , div [] (List.filter (\s -> s.category == "Tools") services |> List.map viewMobileServiceLink)
            ]
        ]


viewServiceLink : Service -> Html msg
viewServiceLink service =
    div [ Html.Attributes.class "group relative" ]
        [ div [ Html.Attributes.class "flex flex-col items-center" ]
            [ a
                [ href service.url
                , Html.Attributes.class "inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200 rounded-md hover:bg-gray-50"
                ]
                [ text service.name
                , viewStatusIndicator service.status
                ]
            , a
                [ href service.swaggerUrl
                , Html.Attributes.class "inline-flex items-center px-3 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200 rounded-md hover:bg-indigo-50"
                ]
                [ text "API"
                , viewStatusIndicator service.status
                ]
            ]
        , div [ Html.Attributes.class "absolute hidden group-hover:block bg-white p-4 rounded-lg shadow-xl z-10 w-72 border border-gray-100 -ml-20 mt-1" ]
            [ div [ Html.Attributes.class "text-sm text-gray-600 mb-2" ] [ text service.description ]
            , div [ Html.Attributes.class "flex items-center justify-between" ]
                [ div [ Html.Attributes.class "text-xs text-indigo-600 font-semibold" ] [ text service.category ]
                , div [ Html.Attributes.class "text-xs" ] [ viewStatusText service.status ]
                ]
            ]
        ]


viewMobileServiceLink : Service -> Html msg
viewMobileServiceLink service =
    div [ Html.Attributes.class "block rounded-md hover:bg-gray-50" ]
        [ div [ Html.Attributes.class "flex flex-col px-3 py-2" ]
            [ a
                [ href service.url
                , Html.Attributes.class "flex items-center text-base font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                ]
                [ text service.name
                , viewStatusIndicator service.status
                ]
            , div [ Html.Attributes.class "mt-1 flex items-center justify-between" ]
                [ p [ Html.Attributes.class "text-sm text-gray-500" ] [ text service.description ]
                , a
                    [ href service.swaggerUrl
                    , Html.Attributes.class "ml-2 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                    ]
                    [ text "API" ]
                ]
            ]
        ]


viewStatusIndicator : String -> Html msg
viewStatusIndicator status =
    let
        (color, title) =
            case status of
                "healthy" ->
                    ("text-green-500", "Service is healthy")
                "unhealthy" ->
                    ("text-yellow-500", "Service is unhealthy")
                "offline" ->
                    ("text-red-500", "Service is offline")
                _ ->
                    ("text-gray-500", "Status unknown")
    in
    span 
        [ Html.Attributes.class ("ml-2 " ++ color)
        , Html.Attributes.title title
        ] 
        [ text "•" ]


viewStatusText : String -> Html msg
viewStatusText status =
    let
        (statusText, color) =
            case status of
                "healthy" ->
                    ("Service is healthy", "text-green-600")
                "unhealthy" ->
                    ("Service is unhealthy", "text-yellow-600")
                "offline" ->
                    ("Service is offline", "text-red-600")
                "container-running" ->
                    ("Container is running", "text-green-600")
                "container-stopped" ->
                    ("Container is stopped", "text-red-600")
                _ ->
                    ("Status unknown", "text-gray-600")
    in
    span [ Html.Attributes.class ("text-xs font-medium " ++ color) ] [ text statusText ] 