import "./App.css";
import MoviePage from "./pages/MoviePage";

function App() {
  console.log(import.meta.env.VITR_TMDB_KEY);
  return (
    <>
      <MoviePage />
    </>
  );
}

export default App;
