import { useEffect, useState } from "react";
import Auth from "./components/Auth";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db, storage } from "./config/firebase";
import { ref, uploadBytes } from "firebase/storage";

const App = () => {
  const [movieList, setMovieList] = useState([]);
  // console.log(movieList)

  // referencer le colletion afin de pouvoir prendre les données
  const movieCollectionRef = collection(db, "movies");

  const getMovieList = async () => {
    try {
      const data = await getDocs(movieCollectionRef);
      // console.log(data)
      const dataFilter = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // console.log(dataFilter)
      setMovieList(dataFilter);
    } catch (error) {
      alert("veuillez vous connecter");
    }
  };

  // console.log(auth)
  useEffect(() => {
    getMovieList();
  }, []);

  // faire un post dans le CRUD
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState();

  // Ajouter
  const onSubmitMovie = async (e) => {
    e.preventDefault();
    await addDoc(movieCollectionRef, {
      title: newMovieTitle,
      releaseDate: newReleaseDate,
      userId: auth.currentUser ? auth.currentUser.uid : null,
    })
      .then(() => {
        setNewMovieTitle("");
        setNewReleaseDate("");
        getMovieList();
      })
      .catch((error) => {
        alert("Veuillez vous connecter d'abord");
      });
  };

  // Supprimer
  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    // alert(movieDoc)
    await deleteDoc(movieDoc)
      .then(() => {
        getMovieList();
      })
      .catch((error) => {
        if (error) {
          alert("Veuillez vous connecter d'abord");
        }
      });
  };

  // mettre à jour
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [targetId, setTargetId] = useState(null);

  const updateMovieTitle = async (id, e) => {
    e.preventDefault();
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, {
      title: updatedTitle,
    })
      .then(() => {
        setUpdatedTitle("");
        getMovieList();
      })
      .catch((error) => {
        if (error) {
          alert("Veuillez vous connecter d'abord");
        }
      });
  };

  const handleChange = (e) => {
    setTargetId(e.target.id);
    setUpdatedTitle(e.target.value);
  };

  // ajouter des fichiers avec firebase
  const [fileUpload, setFileUpload] = useState(null);

  async function uploadFile(e) {
    e.preventDefault();
    if (!fileUpload) return;
    // c'est la référence en précisant l'emplacement
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      // faire le televersement du fichier
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div style={{ textAlign: "center" }}>
      <Auth />
      <div>
        {movieList.map((movie) => (
          <div key={movie.id}>
            <h1>{movie.title}</h1>
            <p> Date: {movie.releaseDate} </p>
            <button onClick={() => deleteMovie(movie.id)}> Delete Movie</button>

            <form onSubmit={(e) => updateMovieTitle(movie.id, e)}>
              <input
                id={movie.id}
                placeholder="new title..."
                onChange={(e) => handleChange(e)}
                value={targetId === movie.id ? updatedTitle : ""}
              />
              <input type="submit" value="Update Title" />
            </form>
          </div>
        ))}
      </div>

      <br />
      <form onSubmit={onSubmitMovie}>
        <input
          value={newMovieTitle}
          placeholder="Movie title..."
          onChange={(e) => setNewMovieTitle(e.target.value)}
        />
        <input
          value={newReleaseDate}
          placeholder="Release Date..."
          type="number"
          onChange={(e) => setNewReleaseDate(Number(e.target.value))}
        />
        <input type="submit" value="Submit Movie" />
      </form>

      <br />
      <br />
      <form onSubmit={uploadFile}>
        <input type="file" onChange={(e) => setFileUpload(e.target.files[0])} />
        <input type="submit" value="Upload File" />
      </form>
    </div>
  );
};

export default App;
