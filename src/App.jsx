import React, { useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";
import { DataTable } from "./components/ui/datatable";
import { Trash2 } from "lucide-react";
import { Edit } from "lucide-react";
import AddContact from "./components/AddContact";
import { getContacts, deleteContact } from "./api/contacts";
import { useEffect } from "react";
import { toast } from "sonner";

function App() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [editContact, setEditContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const fetchContacts = async () => {
    const response = await getContacts();
    setContacts(response?.data);
  };
  useEffect(() => {
    fetchContacts();
  }, []);
  const handleDelete = async (id) => {
    await deleteContact(id);
    toast.success("Contact deleted successfully!");
    fetchContacts();
  };
  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone Number",
    },
    {
      accessorKey: "message",
      header: "Message",
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setEditContact(row.original);
                setOpenAddModal(true);
              }}
            >
              <Edit />
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleDelete(row.original.id);
              }}
            >
              <Trash2 />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col items-end">
      <Button
        onClick={() => {
          setEditContact(null);
          setOpenAddModal(true);
        }}
        className="mb-4"
      >
        Add Contact
      </Button>
      <AddContact
        open={openAddModal}
        onOpenChange={setOpenAddModal}
        initialData={editContact}
        fetchContacts={fetchContacts}
      />
      <DataTable columns={columns} data={contacts} />
    </div>
  );
}

export default App;
