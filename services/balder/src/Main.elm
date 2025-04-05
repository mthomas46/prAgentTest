module Main exposing (main)

import Browser
import Browser.Navigation as Nav
import Dashboard
import Html exposing (Html, div, text)
import Html.Attributes exposing (class)
import Json.Decode as Decode
import Route
import Services.Api as Api
import Services.ServiceList as ServiceList
import Tasks.TaskList as TaskList
import Url

-- MAIN

main : Program Flags Model Msg
main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        , onUrlChange = UrlChanged
        , onUrlRequest = LinkClicked
        }

-- MODEL

type alias Model =
    { key : Nav.Key
    , url : Url.Url
    , page : Page
    , services : ServiceList.Model
    , tasks : TaskList.Model
    , dashboard : Dashboard.Model
    , error : Maybe String
    }

type Page
    = DashboardPage
    | ServiceListPage
    | TaskListPage
    | NotFoundPage

-- Convert Route to Page
routeToPage : Route.Route -> Page
routeToPage route =
    case route of
        Route.Dashboard -> DashboardPage
        Route.ServiceList -> ServiceListPage
        Route.TaskList -> TaskListPage
        Route.NotFound -> NotFoundPage

type alias Flags =
    { version : String
    , environment : String
    }

init : Flags -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init flags url key =
    let
        ( servicesModel, servicesCmd ) =
            ServiceList.init
        
        ( tasksModel, tasksCmd ) =
            TaskList.init
            
        ( dashboardModel, dashboardCmd ) =
            Dashboard.init flags

        model =
            { key = key
            , url = url
            , page = DashboardPage
            , services = servicesModel
            , tasks = tasksModel
            , dashboard = dashboardModel
            , error = Nothing
            }
    in
    ( model
    , Cmd.batch
        [ Cmd.map GotServicesMsg servicesCmd
        , Cmd.map GotTasksMsg tasksCmd
        , Cmd.map GotDashboardMsg dashboardCmd
        ]
    )

-- UPDATE

type Msg
    = LinkClicked Browser.UrlRequest
    | UrlChanged Url.Url
    | GotServicesMsg ServiceList.Msg
    | GotTasksMsg TaskList.Msg
    | GotDashboardMsg Dashboard.Msg

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LinkClicked urlRequest ->
            case urlRequest of
                Browser.Internal url ->
                    ( model, Nav.pushUrl model.key (Url.toString url) )

                Browser.External href ->
                    ( model, Nav.load href )

        UrlChanged url ->
            ( { model | url = url, page = routeToPage (Route.fromUrl url) }
            , Cmd.none
            )

        GotServicesMsg subMsg ->
            let
                ( updatedServicesModel, servicesCmd ) =
                    ServiceList.update subMsg model.services
            in
            ( { model | services = updatedServicesModel }
            , Cmd.map GotServicesMsg servicesCmd
            )

        GotTasksMsg subMsg ->
            let
                ( updatedTasksModel, tasksCmd ) =
                    TaskList.update subMsg model.tasks
            in
            ( { model | tasks = updatedTasksModel }
            , Cmd.map GotTasksMsg tasksCmd
            )

        GotDashboardMsg subMsg ->
            let
                ( updatedDashboardModel, dashboardCmd ) =
                    Dashboard.update subMsg model.dashboard
            in
            ( { model | dashboard = updatedDashboardModel }
            , Cmd.map GotDashboardMsg dashboardCmd
            )

-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Sub.map GotServicesMsg (ServiceList.subscriptions model.services)
        , Sub.map GotDashboardMsg (Dashboard.subscriptions model.dashboard)
        ]

-- VIEW

view : Model -> Browser.Document Msg
view model =
    { title = "Balder Service - Service Discovery and API Gateway"
    , body =
        [ div [ class "app-container" ]
            [ viewHeader
            , viewPage model
            , viewFooter model
            ]
        ]
    }

viewHeader : Html Msg
viewHeader =
    div [ class "header" ]
        [ div [ class "header-content" ]
            [ div [ class "logo" ] [ text "Balder" ]
            , div [ class "nav" ]
                [ Html.a [ Html.Attributes.href "/" ] [ text "Dashboard" ]
                , Html.a [ Html.Attributes.href "/services" ] [ text "Services" ]
                , Html.a [ Html.Attributes.href "/tasks" ] [ text "Tasks" ]
                ]
            ]
        ]

viewPage : Model -> Html Msg
viewPage model =
    div [ class "main-content" ]
        [ case model.page of
            DashboardPage ->
                Html.map GotDashboardMsg (Dashboard.view model.dashboard)

            ServiceListPage ->
                Html.map GotServicesMsg (ServiceList.view model.services)

            TaskListPage ->
                Html.map GotTasksMsg (TaskList.view model.tasks)

            NotFoundPage ->
                div [ class "not-found" ]
                    [ text "Page not found" ]
        ]

viewFooter : Model -> Html Msg
viewFooter model =
    div [ class "footer" ]
        [ div [ class "footer-content" ]
            [ text ("Balder Service " ++ model.dashboard.version)
            , text ("Environment: " ++ model.dashboard.environment)
            ]
        ]