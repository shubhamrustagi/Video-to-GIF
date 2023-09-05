import { useEffect, useState } from "react";
import "./App.css";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { saveAs } from "file-saver";

const ffmpeg = createFFmpeg({
   log: true 
});
function App() {
  const [video, setVideo] = useState();
  const [name, setName] = useState();

  const init = async () => {
    await ffmpeg.load();
  };

  const setVid = (e) => {
    setVideo(e.target.files?.item(0));
    setName(e.target.files[0].name);
  };
  const convertToGif = async () => {
    await ffmpeg.FS("writeFile", name, await fetchFile(video));
    await ffmpeg.run(
      "-i",
      name,
      "-t",
      "2.5",
      "-ss",
      "2.0",
      "-f",
      "gif",
      "output.gif"
    );
    const data = ffmpeg.FS("readFile", "output.gif");
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: "image/gif" })
    );
    saveAs(url, "output.gif");
  };

  useEffect(() => {
    init();
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        {video && (
          <video controls width="250" src={URL.createObjectURL(video)}></video>
        )}
        <input type="file" onChange={(e) => setVid(e)} />
        <button onClick={convertToGif}>Click to convert video to GIF</button>
      </header>
    </div>
  );
}
export default App;
