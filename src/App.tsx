import VideoBackground from "@/components/VideoBackground/VideoBackground.tsx";
import BannerDisplay from "@/components/BannerDisplay/BannerDisplay.tsx";
import VideoTest from "@/components/test.tsx";

function App() {

  return (
      <div className="app">
          <VideoBackground videoPath="/bg.webm" />
          <BannerDisplay/>
      </div>
  )
}

export default App
