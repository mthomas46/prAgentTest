module Tasks.TaskList exposing (Model, Msg, init, subscriptions, update, view)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick, onInput)
import Http
import Json.Decode as Decode
import Json.Encode as Encode
import Time

-- MODEL

type alias Model =
    { tasks : List Task
    , newTask : NewTask
    , loading : Bool
    , error : Maybe String
    }

type alias Task =
    { id : Int
    , title : String
    , description : Maybe String
    , status : String
    , completed : Bool
    , assignedTo : Maybe String
    , dueDate : Maybe String
    , createdAt : String
    , updatedAt : String
    }

type alias NewTask =
    { title : String
    , description : String
    , assignedTo : String
    }

init : ( Model, Cmd Msg )
init =
    ( { tasks = []
      , newTask = 
            { title = ""
            , description = ""
            , assignedTo = ""
            }
      , loading = True
      , error = Nothing
      }
    , fetchTasks
    )

-- UPDATE

type Msg
    = GotTasks (Result Http.Error (List Task))
    | UpdateNewTaskTitle String
    | UpdateNewTaskDescription String
    | UpdateNewTaskAssignedTo String
    | SubmitNewTask
    | TaskCreated (Result Http.Error Task)
    | CompleteTask Int
    | TaskCompleted Int (Result Http.Error Task)
    | DeleteTask Int
    | TaskDeleted Int (Result Http.Error ())
    | RefreshTasks
    | Tick Time.Posix

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotTasks result ->
            case result of
                Ok tasks ->
                    ( { model
                        | tasks = tasks
                        , loading = False
                        , error = Nothing
                      }
                    , Cmd.none
                    )

                Err httpError ->
                    ( { model
                        | loading = False
                        , error = Just (errorToString httpError)
                      }
                    , Cmd.none
                    )

        UpdateNewTaskTitle title ->
            let
                newTask = model.newTask
                updatedNewTask = { newTask | title = title }
            in
            ( { model | newTask = updatedNewTask }, Cmd.none )

        UpdateNewTaskDescription description ->
            let
                newTask = model.newTask
                updatedNewTask = { newTask | description = description }
            in
            ( { model | newTask = updatedNewTask }, Cmd.none )

        UpdateNewTaskAssignedTo assignedTo ->
            let
                newTask = model.newTask
                updatedNewTask = { newTask | assignedTo = assignedTo }
            in
            ( { model | newTask = updatedNewTask }, Cmd.none )

        SubmitNewTask ->
            if String.isEmpty model.newTask.title then
                ( { model | error = Just "Task title cannot be empty" }
                , Cmd.none
                )
            else
                ( { model | loading = True }
                , createTask model.newTask
                )

        TaskCreated result ->
            case result of
                Ok task ->
                    ( { model
                        | tasks = task :: model.tasks
                        , newTask = 
                            { title = ""
                            , description = ""
                            , assignedTo = ""
                            }
                        , loading = False
                        , error = Nothing
                      }
                    , Cmd.none
                    )

                Err httpError ->
                    ( { model
                        | loading = False
                        , error = Just (errorToString httpError)
                      }
                    , Cmd.none
                    )

        CompleteTask taskId ->
            ( { model | loading = True }
            , completeTask taskId
            )

        TaskCompleted taskId result ->
            case result of
                Ok task ->
                    let
                        updateTask t =
                            if t.id == taskId then
                                task
                            else
                                t
                    in
                    ( { model
                        | tasks = List.map updateTask model.tasks
                        , loading = False
                        , error = Nothing
                      }
                    , Cmd.none
                    )

                Err httpError ->
                    ( { model
                        | loading = False
                        , error = Just (errorToString httpError)
                      }
                    , Cmd.none
                    )

        DeleteTask taskId ->
            ( { model | loading = True }
            , deleteTask taskId
            )

        TaskDeleted taskId result ->
            case result of
                Ok _ ->
                    ( { model
                        | tasks = List.filter (\t -> t.id /= taskId) model.tasks
                        , loading = False
                        , error = Nothing
                      }
                    , Cmd.none
                    )

                Err httpError ->
                    ( { model
                        | loading = False
                        , error = Just (errorToString httpError)
                      }
                    , Cmd.none
                    )

        RefreshTasks ->
            ( { model | loading = True }
            , fetchTasks
            )

        Tick _ ->
            if model.loading == False then
                ( model, fetchTasks )
            else
                ( model, Cmd.none )

-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions _ =
    Time.every 30000 Tick

-- VIEW

view : Model -> Html Msg
view model =
    div [ class "tasks-page" ]
        [ div [ class "tasks-header" ]
            [ h1 [] [ text "Task Management" ]
            , p [ class "description" ] [ text "Create and manage tasks for your team" ]
            , button 
                [ class "refresh-button"
                , onClick RefreshTasks
                ] 
                [ text "Refresh" ]
            ]
        , viewNewTaskForm model
        , viewTasksList model
        ]

viewNewTaskForm : Model -> Html Msg
viewNewTaskForm model =
    div [ class "new-task-form" ]
        [ h2 [] [ text "Create New Task" ]
        , div [ class "form-group" ]
            [ label [ for "task-title" ] [ text "Title" ]
            , input 
                [ id "task-title"
                , type_ "text"
                , value model.newTask.title
                , onInput UpdateNewTaskTitle
                , placeholder "Enter task title"
                , class "form-control"
                ] 
                []
            ]
        , div [ class "form-group" ]
            [ label [ for "task-description" ] [ text "Description" ]
            , textarea 
                [ id "task-description"
                , value model.newTask.description
                , onInput UpdateNewTaskDescription
                , placeholder "Enter task description"
                , class "form-control"
                ] 
                []
            ]
        , div [ class "form-group" ]
            [ label [ for "task-assigned" ] [ text "Assigned To" ]
            , input 
                [ id "task-assigned"
                , type_ "text"
                , value model.newTask.assignedTo
                , onInput UpdateNewTaskAssignedTo
                , placeholder "Enter username"
                , class "form-control"
                ] 
                []
            ]
        , button 
            [ class "create-task-button"
            , onClick SubmitNewTask
            , disabled (String.isEmpty model.newTask.title)
            ] 
            [ text "Create Task" ]
        , if model.loading then
            div [ class "form-loading" ] [ text "Processing..." ]
          else
            text ""
        , case model.error of
            Just errorMsg ->
                div [ class "form-error" ] [ text errorMsg ]
            
            Nothing ->
                text ""
        ]

viewTasksList : Model -> Html Msg
viewTasksList model =
    div [ class "tasks-list-container" ]
        [ h2 [] [ text "Tasks" ]
        , if model.loading && List.isEmpty model.tasks then
            div [ class "loading" ] [ text "Loading tasks..." ]
          else if List.isEmpty model.tasks then
            div [ class "no-tasks" ] [ text "No tasks available" ]
          else
            div [ class "tasks-list" ]
                (List.map viewTaskItem model.tasks)
        ]

viewTaskItem : Task -> Html Msg
viewTaskItem task =
    div [ class ("task-item " ++ if task.completed then "completed" else "") ]
        [ div [ class "task-header" ]
            [ h3 [ class "task-title" ] [ text task.title ]
            , div [ class ("task-status " ++ statusClass task.status) ] 
                [ text task.status ]
            ]
        , div [ class "task-description" ] 
            [ text (Maybe.withDefault "No description" task.description) ]
        , div [ class "task-metadata" ]
            [ div [ class "task-assigned" ] 
                [ text ("Assigned to: " ++ Maybe.withDefault "Unassigned" task.assignedTo) ]
            , div [ class "task-date" ] 
                [ text ("Due: " ++ Maybe.withDefault "No due date" task.dueDate) ]
            ]
        , div [ class "task-actions" ]
            [ if not task.completed then
                button 
                    [ class "complete-button"
                    , onClick (CompleteTask task.id)
                    ] 
                    [ text "Complete" ]
              else
                text ""
            , button 
                [ class "delete-button"
                , onClick (DeleteTask task.id)
                ] 
                [ text "Delete" ]
            ]
        ]

-- HELPERS

statusClass : String -> String
statusClass status =
    case status of
        "OPEN" -> "status-open"
        "IN_PROGRESS" -> "status-in-progress"
        "COMPLETED" -> "status-completed"
        _ -> "status-unknown"

errorToString : Http.Error -> String
errorToString error =
    case error of
        Http.BadUrl url ->
            "Bad URL: " ++ url

        Http.Timeout ->
            "Request timed out"

        Http.NetworkError ->
            "Network error"

        Http.BadStatus status ->
            "Bad status: " ++ String.fromInt status

        Http.BadBody message ->
            "Bad body: " ++ message

-- HTTP

fetchTasks : Cmd Msg
fetchTasks =
    Http.get
        { url = "/api/tasks"
        , expect = Http.expectJson GotTasks tasksDecoder
        }

createTask : NewTask -> Cmd Msg
createTask newTask =
    Http.post
        { url = "/api/tasks"
        , body = Http.jsonBody (encodeNewTask newTask)
        , expect = Http.expectJson TaskCreated taskDecoder
        }

completeTask : Int -> Cmd Msg
completeTask taskId =
    Http.request
        { method = "PATCH"
        , headers = []
        , url = "/api/tasks/" ++ String.fromInt taskId ++ "/complete"
        , body = Http.emptyBody
        , expect = Http.expectJson (TaskCompleted taskId) taskDecoder
        , timeout = Nothing
        , tracker = Nothing
        }

deleteTask : Int -> Cmd Msg
deleteTask taskId =
    Http.request
        { method = "DELETE"
        , headers = []
        , url = "/api/tasks/" ++ String.fromInt taskId
        , body = Http.emptyBody
        , expect = Http.expectWhatever (TaskDeleted taskId)
        , timeout = Nothing
        , tracker = Nothing
        }

-- ENCODERS & DECODERS

-- Custom map9 function since Elm only provides up to map8
map9 : (a -> b -> c -> d -> e -> f -> g -> h -> i -> value) -> Decode.Decoder a -> Decode.Decoder b -> Decode.Decoder c -> Decode.Decoder d -> Decode.Decoder e -> Decode.Decoder f -> Decode.Decoder g -> Decode.Decoder h -> Decode.Decoder i -> Decode.Decoder value
map9 constructor da db dc dd de df dg dh di =
    Decode.map8 (\a b c d e f g h -> constructor a b c d e f g h)
        da
        db
        dc
        dd
        de
        df
        dg
        dh
        |> Decode.andThen (\constructor8 -> Decode.map constructor8 di)

tasksDecoder : Decode.Decoder (List Task)
tasksDecoder =
    Decode.list taskDecoder

taskDecoder : Decode.Decoder Task
taskDecoder =
    map9 Task
        (Decode.field "id" Decode.int)
        (Decode.field "title" Decode.string)
        (Decode.maybe (Decode.field "description" Decode.string))
        (Decode.field "status" Decode.string)
        (Decode.field "completed" Decode.bool)
        (Decode.maybe (Decode.field "assignedTo" Decode.string))
        (Decode.maybe (Decode.field "dueDate" Decode.string))
        (Decode.field "createdAt" Decode.string)
        (Decode.field "updatedAt" Decode.string)

encodeNewTask : NewTask -> Encode.Value
encodeNewTask task =
    Encode.object
        [ ("title", Encode.string task.title)
        , ("description", Encode.string task.description)
        , ("assignedTo", Encode.string task.assignedTo)
        ]
