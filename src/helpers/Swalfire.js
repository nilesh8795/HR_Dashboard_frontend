
import Swal from "sweetalert2";


export const showSuccess = (title,text) => {
  Swal.fire({
    icon: "success",
    title,
    text,
  });
};


export const showError = (title = "Error!", text = "") => {
  Swal.fire({
    icon: "error",
    title,
    text,
  });
};


export const showInfo = (title = "Note", text = "") => {
  Swal.fire({
    icon: "info",
    title,
    text,
  });
};

// Confirmation Alert
export const showConfirm = async (title = "Are you sure?", text = "") => {
  const result = await Swal.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });

  return result.isConfirmed;
};
