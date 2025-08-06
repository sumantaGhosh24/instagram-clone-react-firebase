import {type FormEvent, type ReactNode, useState} from "react";
import {doc, updateDoc} from "firebase/firestore";
import {X, Upload, UserCog} from "lucide-react";
import {toast} from "react-toastify";

import {useFirebase} from "../firebase/auth-context";
import {db} from "../firebase/firebase";
import {deleteImage, uploadImage} from "../firebase/storage";

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
              <h2 className="text-lg font-bold">Update Profile</h2>
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

const UpdateProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const firebase = useFirebase();

  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(firebase.authUser?.fullName);
  const [file, setFile] = useState<any>(null);

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      if (!file) {
        const obj = {fullName};
        await updateDoc(
          doc(db, "users", firebase!.authUser!.id),
          {...(obj as any)},
          {merge: true}
        );
        toast.success("Profile updated successfully.");
        closeModal();
      } else {
        if (firebase.authUser?.imageUrl) {
          await deleteImage(firebase.authUser?.imageUrl);
        }
        const imageUrl = await uploadImage(file, "users");
        const obj = {imageUrl};
        await updateDoc(
          doc(db, "users", firebase!.authUser!.id),
          {...(obj as any)},
          {merge: true}
        );
        toast.success("Image updated successfully!");
        closeModal();
        setFile(null);
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
        <UserCog size={30} className="text-gray-500 mr-6 cursor-pointer" />
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <form onSubmit={handleUpdateProfile} method="POST">
          <div>
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : firebase.authUser?.imageUrl
                  ? firebase.authUser?.imageUrl
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
            Profile Image <Upload size={48} />
          </label>
          <input
            type="file"
            id="file"
            onChange={(e: any) => setFile(e.target.files[0])}
            className="hidden"
          />
          <input
            aria-label="Enter your full name"
            type="text"
            placeholder="Fullname"
            className="text-sm text-gray-500 w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
          />
          <div className="flex items-center gap-3 mt-5">
            <button
              disabled={loading}
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
            >
              {loading ? "Processing..." : "Update Profile"}
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

export default UpdateProfile;
