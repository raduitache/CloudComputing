import {IncomingMessage, ServerResponse} from "http";
import {getRequestBody} from "../util/request-data";
import {StatusCodes} from "http-status-codes";
import {Anime} from "../entity/anime.dto";

export async function createAnime(req: IncomingMessage, res: ServerResponse) {
    let body = await getRequestBody(req);
    if (body.name) {
        let newAnime = new Anime();
        newAnime.name = body.name;
        await newAnime.save();
        if (newAnime) {
            res.writeHead(StatusCodes.CREATED, {});
            res.end(JSON.stringify(newAnime));
            return;
        }
        res.writeHead(StatusCodes.INTERNAL_SERVER_ERROR, {
            "Content-Type": "application/json"
        });
        res.end(JSON.stringify({
            message: "Could not create new anime."
        }));
        return;
    }
    res.writeHead(StatusCodes.BAD_REQUEST, {
        "Content-Type": "application/json"
    });
    res.end(JSON.stringify({
        message: "Parameters required were not provided."
    }));
}

export async function getAllAnime(req: IncomingMessage, res: ServerResponse) {
    let anime = await Anime.find();
    res.writeHead(StatusCodes.OK, {
        "Content-Type": "application/json"
    });
    res.end(JSON.stringify(anime));
}

export async function getAnime(req: IncomingMessage, res: ServerResponse) {
    let anime = await Anime.findOne(req.url?.split("/")[2]);
    if (anime) {
        res.writeHead(StatusCodes.OK, {
            "Content-Type": "application/json"
        });
        res.end(JSON.stringify(anime));
        return;
    }
    res.writeHead(StatusCodes.NOT_FOUND, {
        "Content-Type": "application/json"
    });
    res.end(JSON.stringify({
        message: "Invalid anime id."
    }));
}

export async function updateAnime(req: IncomingMessage, res: ServerResponse) {
    let body = await getRequestBody(req);
    let anime = await Anime.findOne(req.url?.split("/")[2]);
    if (anime) {
        if (body.name) {
            anime.name = body.name;
        }
        await anime.save();
        res.writeHead(StatusCodes.OK, {
            "Content-Type": "application/json"
        });
        res.end(JSON.stringify(anime));
        return;
    }
    res.writeHead(StatusCodes.NOT_FOUND, {
        "Content-Type": "application/json"
    });
    res.end(JSON.stringify({
        message: "Invalid anime id."
    }));
}