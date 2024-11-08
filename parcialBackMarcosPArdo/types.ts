import type { ObjectId } from "mongodb";

export type Libro ={
    titulo:string
    autores: Autores[]
    copiasDisponibles:number
}

export type Autores ={
    nombreCompleto:string
    biografia:string
}


export type libroModelType ={
    _id?: ObjectId
    titulo:string
    autores: ObjectId[]
    copiasDisponibles:number
}

export type autoresModelType ={
    _id?: ObjectId
    nombreCompleto:string
    biografia:string
}