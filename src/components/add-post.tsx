import {FormEvent, ReactNode, useState} from "react";
import {addDoc, collection} from "firebase/firestore";
import {Plus, X, Upload} from "lucide-react";
import {toast} from "react-toastify";

import {useFirebase} from "../firebase/auth-context";
import {db} from "../firebase/firebase";
import {uploadImage} from "../firebase/storage";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({isOpen, onClose, children}: ModalProps) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-5 w-[80%]">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold">Create Post</h2>
              <button onClick={onClose}>
                <X size={30} className="text-gray-500 mr-6 cursor-pointer" />
              </button>
            </div>
            <div>{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

const AddPost = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<any>(null);

  const firebase = useFirebase();

  const handleCreatePost = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      if (caption === "" || !file) {
        toast.error("Please fill all the fields.");
      } else {
        const imageUrl = await uploadImage(file, "posts");

        const obj = {
          userId: firebase.authUser?.id,
          imageSrc: imageUrl,
          caption,
          likes: [],
          comments: [],
          dateCreated: Date.now(),
        };

        await addDoc(collection(db, "posts"), obj);

        setFile(null);
        setCaption("");
        toast.success("Post created successfully.");
        closeModal();
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={openModal}>
        <Plus size={30} className="text-gray-500 mr-6 cursor-pointer" />
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <form onSubmit={handleCreatePost} method="POST">
          <div>
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt="avatar"
              className="block h-36 w-36 rounded-full z-50 bg-black mx-auto mb-5"
            />
          </div>
          <label
            htmlFor="file"
            className="flex items-center gap-3 mb-5 cursor-pointer"
          >
            Post Image <Upload size={48} />
          </label>
          <input
            type="file"
            id="file"
            onChange={(e: any) => setFile(e.target.files[0])}
            className="hidden"
          />
          <input
            aria-label="Enter post caption"
            type="text"
            placeholder="Caption"
            className="text-sm text-gray-500 w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
            onChange={(e) => setCaption(e.target.value)}
            value={caption}
          />
          <div className="flex items-center gap-3 mt-5">
            <button
              disabled={loading}
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
            >
              {loading ? "Processing..." : "Create Post"}
            </button>
            <button
              onClick={closeModal}
              type="button"
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
            >
              Close
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddPost;
