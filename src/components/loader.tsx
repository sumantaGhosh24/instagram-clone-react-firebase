import {TailSpin} from "react-loader-spinner";

export default function ReactLoader() {
  return (
    <TailSpin
      visible={true}
      height="80"
      width="80"
      color="#000000"
      ariaLabel="tail-spin-loading"
      radius="1"
      wrapperClass="flex justify-center mt-12"
    />
  );
}
