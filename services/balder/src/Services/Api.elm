module Services.Api exposing (Service, ServiceHealth, fetchServiceHealth, fetchServices)

import Http
import Json.Decode as Decode

-- TYPES

type alias Service =
    { id : String
    , name : String
    , url : String
    , description : String
    , status : String
    , hasHealthEndpoint : Bool
    }

type alias ServiceHealth =
    { status : String
    , data : Decode.Value
    }

-- HTTP REQUESTS

fetchServices : (Result Http.Error (List Service) -> msg) -> Cmd msg
fetchServices toMsg =
    Http.get
        { url = "/api/services"
        , expect = Http.expectJson toMsg servicesDecoder
        }

fetchServiceHealth : String -> (Result Http.Error ServiceHealth -> msg) -> Cmd msg
fetchServiceHealth serviceId toMsg =
    Http.get
        { url = "/api/services/" ++ serviceId ++ "/status"
        , expect = Http.expectJson toMsg serviceHealthDecoder
        }

-- DECODERS

servicesDecoder : Decode.Decoder (List Service)
servicesDecoder =
    Decode.list serviceDecoder

serviceDecoder : Decode.Decoder Service
serviceDecoder =
    Decode.map6 Service
        (Decode.field "id" Decode.string)
        (Decode.field "name" Decode.string)
        (Decode.field "url" Decode.string)
        (Decode.field "description" Decode.string)
        (Decode.field "status" Decode.string)
        (Decode.field "hasHealthEndpoint" Decode.bool)

serviceHealthDecoder : Decode.Decoder ServiceHealth
serviceHealthDecoder =
    Decode.map2 ServiceHealth
        (Decode.field "status" Decode.string)
        (Decode.field "data" Decode.value)
