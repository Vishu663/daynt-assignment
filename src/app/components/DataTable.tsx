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
import {
  fetchData,
  addItem,
  updateItem,
  deleteItem,
} from "../services/dataService";
import { useRouter } from "next/navigation";
import authService from "../services/authService";

interface DataTable {
  id: string;
  name: string;
  DOB: Timestamp;
}

const calculateAge = (DOB?: Timestamp): number => {
  if (!DOB || isNaN(DOB.toDate().getTime())) {
    return 0; // Fallback age
  }
  const birthDate = DOB.toDate();
  const ageDiffMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDiffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const formatDate = (DOB?: Timestamp): string => {
  if (!DOB || !DOB.seconds) {
    return "Invalid Date";
  }
  return DOB.toDate().toLocaleDateString();
};

const DataTableComponent = () => {
  const [data, setData] = useState<DataTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState<{ name: string; DOB: string }>({
    name: "",
    DOB: "",
  });
  const [editItem, setEditItem] = useState<DataTable | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);

  useEffect(() => {
    fetchData()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAdd = () => {
    const { name, DOB } = newItem;
    if (!DOB) {
      console.log("DOB is required");
      return;
    }

    const DOBTimestamp = Timestamp.fromDate(new Date(DOB));
    addItem({ name, DOB: DOBTimestamp })
      .then(() => {
        setSnackbarMessage("Item added successfully");
        setOpenSnackbar(true);
        fetchData().then((res: DataTable[]) => setData(res));
        setOpenModal(false);
      })
      .catch(() => {
        setSnackbarMessage("Failed to add item");
        setOpenSnackbar(true);
      });
  };

  const handleEdit = () => {
    if (!editItem) return;

    const updatedItem = {
      ...editItem,
      DOB: Timestamp.fromDate(new Date(editItem.DOB.toDate())),
    };

    updateItem(editItem.id, updatedItem)
      .then(() => {
        setSnackbarMessage("Item updated successfully");
        setOpenSnackbar(true);
        fetchData().then((res: DataTable[]) => setData(res));
        setOpenEditModal(false);
      })
      .catch(() => {
        setSnackbarMessage("Failed to update item");
        setOpenSnackbar(true);
      });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    deleteItem(id)
      .then(() => {
        setSnackbarMessage("Item deleted successfully");
        setOpenSnackbar(true);
        fetchData().then((res: DataTable[]) => setData(res));
      })
      .catch(() => {
        setSnackbarMessage("Failed to delete item");
        setOpenSnackbar(true);
      });
  };

  const router = useRouter();

  const handleLogout = (): void => {
    authService.logout();
    router.push("/");
  };

  return (
    <div className="w-full">
      <div className="w-full flex justify-between">
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => setOpenModal(true)}
        >
          Add New Item
        </Button>
        <Button
          onClick={handleLogout}
          variant="contained"
          color="error"
          sx={{ mt: 2 }}
        >
          Logout
        </Button>
      </div>
      <TableContainer>
        <Table sx={{ color: "white" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "white" }}>Name</TableCell>
              <TableCell sx={{ color: "white" }}>Age</TableCell>
              <TableCell sx={{ color: "white" }}>Date of Birth</TableCell>
              <TableCell sx={{ color: "white" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4}>Loading...</TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ color: "white" }}>{row.name}</TableCell>
                  <TableCell sx={{ color: "white" }}>
                    {row.DOB ? calculateAge(row.DOB) : "N/A"}
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    {row.DOB ? formatDate(row.DOB) : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setEditItem(row);
                        setOpenEditModal(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDelete(row.id)}
                      style={{ marginLeft: "8px" }}
                    >
                      Delete
                    </Button>
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
            value={newItem.DOB}
            onChange={(e) => setNewItem({ ...newItem, DOB: e.target.value })}
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

      {/* Modal for Editing Item */}
      {editItem && (
        <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              fullWidth
              value={editItem.name}
              onChange={(e) =>
                setEditItem({ ...editItem, name: e.target.value })
              }
              margin="normal"
            />
            <TextField
              type="date"
              fullWidth
              value={formatDate(editItem.DOB)}
              onChange={(e) =>
                setEditItem({
                  ...editItem,
                  DOB: Timestamp.fromDate(new Date(e.target.value)),
                })
              }
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditModal(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleEdit} color="primary">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default DataTableComponent;
