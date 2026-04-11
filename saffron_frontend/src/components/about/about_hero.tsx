import heroVideo from "@/assets/about-hero-video-new.mp4";

const HeroVideo = () => {
  return (
   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" >
      
      {/* VIDEO */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover lg:object-cover"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* GOLD CINEMATIC SHIMMER */}
      <div className="absolute inset-0 bg-gradient-to-tr from-gold/5 via-transparent to-gold/10 opacity-60" />

    </div>
  );
};

export default HeroVideo;
