import loginImage from "../../assets/loginIcon.jpg";

export default function Login() {
  return (
    <div className="flex h-screen w-full justify-end">
      <img
        src={loginImage}
        alt="Login Background"
        className="h-full w-full object-cover"
      />
      <div
        className="absolute flex h-full w-1/2 flex-col items-center justify-center"
        style={{
          background:
            "linear-gradient(90deg, rgba(0, 0, 0, 0.11) 1.07%, rgba(0, 0, 0, 0.50) 11.3%, rgba(0, 0, 0, 0.55) 15.04%, rgba(0, 0, 0, 0.60) 25.66%, rgba(0, 0, 0, 0.65) 32.15%, rgba(0, 0, 0, 0.70) 42.19%, rgba(0, 0, 0, 0.75) 52.22%, rgba(0, 0, 0, 0.80) 64.02%, rgba(0, 0, 0, 0.90) 79.66%, #000 100%)",
        }}
      >
        <h1 className="text-5xl font-bold text-white md:scale-75 xl:scale-100">
          BEM VINDO!
        </h1>
        <h2 className="text-3xl text-white/90 md:scale-75 xl:scale-100">
          AO FIND TO WATCH
        </h2>
      </div>
    </div>
  );
}
