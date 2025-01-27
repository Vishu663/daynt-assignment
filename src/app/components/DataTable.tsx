import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { fetchData, addItem } from "../services/dataService";

interface DataTable {
  id: string;
  name: string;
  DOB: Timestamp; // Storing the DOB as Timestamp
}

const calculateAge = (dob?: Timestamp): number => {
  if (!dob || isNaN(dob.toDate().getTime())) {
    return 0; // Fallback age
  }
  const birthDate = dob.toDate();
  const ageDiffMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDiffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const formatDate = (dob?: Timestamp): string => {
  if (!dob || !dob.seconds) {
    return "Invalid Date";
  }
  return dob.toDate().toLocaleDateString();
};

const DataTableComponent = () => {
  const [data, setData] = useState<DataTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState<{ name: string; dob: string }>({
    name: "",
    dob: "", // Capture the date input as string (YYYY-MM-DD)
  });
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    fetchData()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // const handleAdd = () => {
  //   const { name, dob } = newItem;
  //   if (!dob) {
  //     console.log("DOB is required");
  //     return;
  //   }

  //   // Convert the string to Firestore Timestamp directly
  //   const dobTimestamp = Timestamp.fromDate(new Date(dob)); // Store DOB as Timestamp

  //   // Add to Firestore
  //   addItem({ name, dob: dobTimestamp })
  //     .then(() => {
  //       setSnackbarMessage("Item added successfully");
  //       setOpenSnackbar(true);
  //       fetchData().then((res: DataTable[]) => setData(res));
  //     })
  //     .catch(() => {
  //       setSnackbarMessage("Failed to add item");
  //       setOpenSnackbar(true);
  //     });
  // };

  const handleAdd = () => {
    setSnackbarMessage("IN testing");
    setOpenSnackbar(true);
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenModal(true)}
      >
        Add New Item
      </Button>

      <TableContainer>
        <Table sx={{ color: "white" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "white" }}>Name</TableCell>
              <TableCell sx={{ color: "white" }}>Age</TableCell>
              <TableCell sx={{ color: "white" }}>Date of Birth</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3}>Loading...</TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow key={row.id || index}>
                  <TableCell sx={{ color: "white" }}>
                    {row.name || "Unknown"}
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    {row.DOB ? calculateAge(row.DOB) : "N/A"}
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    {row.DOB ? formatDate(row.DOB) : "N/A"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />

      {/* Modal for Adding New Item */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            margin="normal"
          />
          <TextField
            type="date"
            fullWidth
            value={newItem.dob}
            onChange={(e) => setNewItem({ ...newItem, dob: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAdd} color="primary">
            Add Item
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DataTableComponent;
