import {Collection, MongoClient} from "mongodb"
import { libroModelType, autoresModelType, Libro, Autores } from "./types.ts"
import { ObjectId } from "mongodb";


export const fromModelToAutor = (elem: autoresModelType) =>({
    id: elem._id!.toString(),
    nombreCompleto: elem.nombreCompleto,
    biografia: elem.biografia
})


export const fromModelToLibro = async (elem: libroModelType, autoresCollection: Collection<autoresModelType>): Promise<Libro> =>{
    const autor= await autoresCollection.find({_id: {$in: elem.autores}}).toArray()
    return{
        id: elem._id!.toString(),
        titulo: elem.titulo,
        copiasDisponibles: elem.copiasDisponibles,
        autores: autor.map((b)=> fromModelToAutor(b))

    }
}