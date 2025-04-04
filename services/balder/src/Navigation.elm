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
    nav [ Html.Attributes.class "bg-white shadow-sm" ]
        [ div [ Html.Attributes.class "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ]
            [ div [ Html.Attributes.class "flex justify-between h-16" ]
                [ div [ Html.Attributes.class "flex" ]
                    [ div [ Html.Attributes.class "flex-shrink-0 flex items-center" ]
                        [ img
                            [ Html.Attributes.class "h-8 w-auto"
                            , src "/logo.png"
                            , alt "Logo"
                            ]
                            []
                        ]
                    , div [ Html.Attributes.class "hidden sm:ml-6 sm:flex sm:space-x-8" ]
                        [ a
                            [ href "#"
                            , Html.Attributes.class "border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            ]
                            [ text "Dashboard" ]
                        , a
                            [ href "#"
                            , Html.Attributes.class "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            ]
                            [ text "Services" ]
                        , a
                            [ href "#"
                            , Html.Attributes.class "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            ]
                            [ text "Tools" ]
                        ]
                    ]
                , div [ Html.Attributes.class "hidden sm:ml-6 sm:flex sm:items-center" ]
                    [ div [ Html.Attributes.class "ml-3 relative" ]
                        [ div []
                            [ button
                                [ Html.Attributes.class "bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                ]
                                [ span [ Html.Attributes.class "sr-only" ] [ text "View notifications" ]
                                , svg
                                    [ Html.Attributes.class "h-6 w-6"
                                    , Svg.Attributes.fill "none"
                                    , Svg.Attributes.viewBox "0 0 24 24"
                                    , Svg.Attributes.stroke "currentColor"
                                    ]
                                    [ Svg.path
                                        [ Svg.Attributes.strokeLinecap "round"
                                        , Svg.Attributes.strokeLinejoin "round"
                                        , Svg.Attributes.strokeWidth "2"
                                        , Svg.Attributes.d "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                        ]
                                        []
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ]


viewNavItem : NavItem -> Html Msg
viewNavItem item =
    a
        [ href item.url
        , Html.Attributes.class "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
        , Html.Attributes.class
            (if item.isActive then
                "border-indigo-500 text-gray-900"
            else
                "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            )
        ]
        [ text item.name ]


viewServiceCard : Service -> Html Msg
viewServiceCard service =
    div [ Html.Attributes.class "bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100 mb-6" ]
        [ div [ Html.Attributes.class "p-6" ]
            [ div [ Html.Attributes.class "flex items-center justify-between mb-4" ]
                [ h2 [ Html.Attributes.class "text-xl font-semibold text-gray-900" ] [ text service.name ]
                , viewStatusIndicator service.status
                ]
            , p [ Html.Attributes.class "text-gray-600 mb-4" ] [ text service.description ]
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
                [ div [ Html.Attributes.class "mt-2" ] [ viewStatusText service.status ]
                ]
            ]
        ]


viewStatusIndicator : String -> Html msg
viewStatusIndicator status =
    let
        color =
            case status of
                "available" ->
                    "text-green-500"
                "unavailable" ->
                    "text-red-500"
                "degraded" ->
                    "text-yellow-500"
                _ ->
                    "text-gray-500"
    in
    span [ Html.Attributes.class ("text-sm " ++ color) ]
        [ text "•" ]


viewStatusText : String -> Html msg
viewStatusText status =
    let
        (statusText, color) =
            case status of
                "available" ->
                    ("Service is available", "text-green-600")
                "unavailable" ->
                    ("Service is unavailable", "text-red-600")
                "degraded" ->
                    ("Service is degraded", "text-yellow-600")
                _ ->
                    ("Status unknown", "text-gray-600")
    in
    span [ Html.Attributes.class ("text-sm font-medium " ++ color) ] [ text statusText ] 