module Main exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Decode as Decode
import Json.Encode as Encode

type alias Task =
    { id : String
    , title : String
    , description : String
    , status : String
    }

type alias Model =
    { tasks : List Task
    , newTask : { title : String, description : String }
    , error : Maybe String
    }

type Msg
    = FetchTasks
    | TasksReceived (Result Http.Error (List Task))
    | UpdateTitle String
    | UpdateDescription String
    | CreateTask
    | TaskCreated (Result Http.Error Task)
    | DeleteTask String
    | TaskDeleted String (Result Http.Error ())

init : { apiUrl : String } -> ( Model, Cmd Msg )
init flags =
    ( { tasks = []
      , newTask = { title = "", description = "" }
      , error = Nothing
      }
    , fetchTasks flags.apiUrl
    )

fetchTasks : String -> Cmd Msg
fetchTasks apiUrl =
    Http.get
        { url = apiUrl ++ "/tasks"
        , expect = Http.expectJson TasksReceived (Decode.list taskDecoder)
        }

taskDecoder : Decode.Decoder Task
taskDecoder =
    Decode.map4 Task
        (Decode.field "id" Decode.string)
        (Decode.field "title" Decode.string)
        (Decode.field "description" Decode.string)
        (Decode.field "status" Decode.string)

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        FetchTasks ->
            ( model, fetchTasks "/api" )

        TasksReceived (Ok tasks) ->
            ( { model | tasks = tasks, error = Nothing }, Cmd.none )

        TasksReceived (Err _) ->
            ( { model | error = Just "Failed to fetch tasks" }, Cmd.none )

        UpdateTitle title ->
            let
                newTask = model.newTask
            in
            ( { model | newTask = { newTask | title = title } }, Cmd.none )

        UpdateDescription description ->
            let
                newTask = model.newTask
            in
            ( { model | newTask = { newTask | description = description } }, Cmd.none )

        CreateTask ->
            let
                taskJson =
                    Encode.object
                        [ ( "title", Encode.string model.newTask.title )
                        , ( "description", Encode.string model.newTask.description )
                        ]
            in
            ( model
            , Http.post
                { url = "/api/tasks"
                , body = Http.jsonBody taskJson
                , expect = Http.expectJson TaskCreated taskDecoder
                }
            )

        TaskCreated (Ok task) ->
            ( { model
                | tasks = task :: model.tasks
                , newTask = { title = "", description = "" }
                , error = Nothing
              }
            , Cmd.none
            )

        TaskCreated (Err _) ->
            ( { model | error = Just "Failed to create task" }, Cmd.none )

        DeleteTask id ->
            ( model
            , Http.request
                { method = "DELETE"
                , headers = []
                , url = "/api/tasks/" ++ id
                , body = Http.emptyBody
                , expect = Http.expectWhatever (TaskDeleted id)
                , timeout = Nothing
                , tracker = Nothing
                }
            )

        TaskDeleted id (Ok _) ->
            ( { model
                | tasks = List.filter (taskNotMatchingId id) model.tasks
                , error = Nothing
              }
            , Cmd.none
            )

        TaskDeleted _ (Err _) ->
            ( { model | error = Just "Failed to delete task" }, Cmd.none )

taskNotMatchingId : String -> Task -> Bool
taskNotMatchingId id task =
    task.id /= id

view : Model -> Html Msg
view model =
    div [ class "max-w-4xl mx-auto" ]
        [ div [ class "flex justify-between items-center mb-8" ]
            [ h1 [ class "text-3xl font-bold" ] [ text "Task Management" ]
            , a 
                [ href "/api-docs"
                , target "_blank"
                , class "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                ] 
                [ text "API Documentation" ]
            ]
        , viewError model.error
        , viewTaskForm model.newTask
        , viewTaskList model.tasks
        ]

viewError : Maybe String -> Html Msg
viewError error =
    case error of
        Just message ->
            div [ class "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" ]
                [ text message ]

        Nothing ->
            text ""

viewTaskForm : { title : String, description : String } -> Html Msg
viewTaskForm newTask =
    div [ class "bg-white p-6 rounded-lg shadow-md mb-8" ]
        [ h2 [ class "text-xl font-semibold mb-4" ] [ text "Create New Task" ]
        , div [ class "mb-4" ]
            [ label [ class "block text-gray-700 text-sm font-bold mb-2" ] [ text "Title" ]
            , input
                [ type_ "text"
                , value newTask.title
                , onInput UpdateTitle
                , class "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                ]
                []
            ]
        , div [ class "mb-4" ]
            [ label [ class "block text-gray-700 text-sm font-bold mb-2" ] [ text "Description" ]
            , textarea
                [ value newTask.description
                , onInput UpdateDescription
                , class "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                ]
                []
            ]
        , button
            [ onClick CreateTask
            , class "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            ]
            [ text "Create Task" ]
        ]

viewTaskList : List Task -> Html Msg
viewTaskList tasks =
    div [ class "bg-white p-6 rounded-lg shadow-md" ]
        [ h2 [ class "text-xl font-semibold mb-4" ] [ text "Tasks" ]
        , if List.isEmpty tasks then
            p [ class "text-gray-500" ] [ text "No tasks yet. Create one above!" ]
          else
            ul [] (List.map viewTask tasks)
        ]

viewTask : Task -> Html Msg
viewTask task =
    li [ class "border-b border-gray-200 py-4" ]
        [ div [ class "flex justify-between items-center" ]
            [ div []
                [ h3 [ class "text-lg font-semibold" ] [ text task.title ]
                , p [ class "text-gray-600" ] [ text task.description ]
                , span [ class "text-sm text-gray-500" ] [ text ("Status: " ++ task.status) ]
                ]
            , button
                [ onClick (DeleteTask task.id)
                , class "bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                ]
                [ text "Delete" ]
            ]
        ]

main : Program { apiUrl : String } Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = \_ -> Sub.none
        } 