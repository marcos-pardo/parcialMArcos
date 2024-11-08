import {MongoClient} from "mongodb"
import { libroModelType, autoresModelType, Libro, Autores } from "./types.ts"
import { ObjectId } from "mongodb";

const MONGO_URL = Deno.env.get ("MONGO_URL")

if(!MONGO_URL){
  console.log("no entra en el env")
  Deno.exit(1)
}

const client  = new MongoClient(MONGO_URL);
await client.connect()
const db = client.db("parcialMarcos")

const librosCollection = db.collection <libroModelType>("LIBROS")
const autoresCollection = db.collection <autoresModelType>("AUTORES")


export const handler = async (req:Request):Promise<Response> => {
  try {
    const method = req.method;
    const url = new URL(req.url);
    const path = url.pathname;

   if(method ==="POST"){
      if(path==="/libro"){
        const libro = await req.json()
        if(!libro) return new Response ("Bad Request",{status:400})
          if(!libro.titulo || !libro.autores || !libro.copiasDisponibles) return new Response ("falta alguno de los campos",{status:400})
      const hayAutor = await autoresCollection.find({_id: {$in: libro.autores.map((b:string)=>new ObjectId(b))}}).toArray()
      if(hayAutor.length !== libro.autores.length) return new Response ("Autor no existe",{status:400})
        const crearLibro = await librosCollection.insertOne({
          _id: new ObjectId(),
          titulo: libro.titulo,
          autores: libro.autores.map((b:string)=>new ObjectId(b)),
          copiasDisponibles : libro.copiasDisponibles
      })
      return new Response(JSON.stringify(crearLibro),{status:201})
      }
      if(path==="/autor"){
        const autor = await req.json()
        if(!autor) return new Response ("Bad Request",{status:400})
          if(!autor.nombreCompleto || !autor.biografia ) return new Response ("falta alguno de los campos",{status:400})
        const crearAutor = await autoresCollection.insertOne({
          _id: new ObjectId(),
          nombreCompleto : autor.nombreCompleto,
          biografia : autor.biografia
      })
      return new Response(JSON.stringify({crearAutor
      }),{status:201})
      }

    }
    if(method ==="GET"){
      if(path==="/libros"){
        const libros = await librosCollection.find().toArray()
        //const todosLibros = await libros.map((b))


      }
    }
    if(method ==="PUT"){
      if(path==="/libro"){
        const libro = await req.json()
        if(!libro) return new Response ("Bad Request",{status:400})
          if(!libro.titulo || !libro.autores || !libro.copiasDisponibles) return new Response ("falta alguno de los campos",{status:400})
      const hayAutor = await autoresCollection.find({_id: {$in: libro.autores.map((b:string)=>new ObjectId(b))}}).toArray()
      if(hayAutor.length !== libro.autores.length) return new Response ("Autor no existe",{status:400})
        const idLibro = await librosCollection.findOne({_id: new ObjectId(libro.id as string)})
      if(!idLibro) return new Response ("no hay id Libro",{status:404})

        const updateLibro = await librosCollection.updateOne({
          _id: new ObjectId(libro.id as string)},{$set:{         
             titulo: libro.titulo,
            autores: libro.autores.map((b:string)=>new ObjectId(b)),
            copiasDisponibles : libro.copiasDisponibles}}
    
          )
      return new Response(JSON.stringify(updateLibro),{status:200})
      }

        

      }

    if(method ==="DELETE"){
      if(path==="/libro"){
        const libro = await req.json()
        if(!libro) return new Response ("Bad Request",{status:400})
          if(!libro.id ) return new Response ("falta el id",{status:400})
            const idLibro = await librosCollection.findOne({_id: new ObjectId(libro.id as string)})
        if(!idLibro) return new Response ("no hay id Libro",{status:404})
          const borrarLibro = await librosCollection.deleteOne({_id: new ObjectId(libro.id as string)})
        return new Response(JSON.stringify(borrarLibro),{status:200})

        

      }
    }


    return new Response(`hay error en el ${path}`,{status:400})
  } catch (error) {
    console.log(error)
    throw new Error("error")
    
  }
}

Deno.serve({port:3000},handler)