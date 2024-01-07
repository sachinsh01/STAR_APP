// Import necessary libraries 
import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { useCookies } from "react-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-calendar/dist/Calendar.css";
import "./holidays.css";
import "react-toastify/dist/ReactToastify.css";
import { FiEdit } from "react-icons/fi";
import HolidayInputModal from "./HolidayInputModal";
import HolidayEditModal from "./HolidayEditModal";
import Modal from "react-modal";
import Navbar from "../Navbar";
import SideNav from "../SideNav";

function Holidays() {
  const [holidays, setHolidays] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const holidaysPerPage = 6;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editHolidayData, setEditHolidayData] = useState(null);
  const [actionOccured, setActionOccurred] = useState(false);

  function handleEdit(id, name, date) {
    const holidayData = {
      _id: id,
      name: name,
      date: new Date(date),
    };

    setIsEditModalOpen(true);
    setEditHolidayData(holidayData);
  }
 
  //Set the baseURL
  const baseURL = process.env.NODE_ENV === 'production' ? 'https://3.108.23.98/API' : 'http://localhost:4000';

  useEffect(() => {
    axios({
      method: "get",
      url: baseURL + "/holidays/all",
      // headers : {
      //     Authorizaton : `Bearer ${cookies.token}`
      // }
    })
      .then((response) => {
        setHolidays(response.data);
      })
      .catch((error) => {
        console.log("error in getting holidays->", error);
      });
    if (actionOccured) {
      setActionOccurred(false);
    }
  }, [actionOccured]);
  // }, [handleEditHoliday, handleSubmit]);

  const indexOfLastHoliday = currentPage * holidaysPerPage;
  const indexOfFirstHoliday = indexOfLastHoliday - holidaysPerPage;
  const currentHolidays = holidays.slice(
    indexOfFirstHoliday,
    indexOfLastHoliday
  );

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  function handleSubmit(newHoliday) {
    let isDuplicateName = false;
    let isDuplicateDate = false;
    
    // checking the holiday name or date does not already exists
    holidays.forEach((holiday) => {
      if (holiday.date === newHoliday.date) {
        return (isDuplicateDate = true);
      }
    });

    holidays.forEach((holiday) => {
      if (holiday.name.toLowerCase() === newHoliday.name.toLowerCase()) {
        return (isDuplicateName = true);
      }
    });

    if (isDuplicateDate) {
      alert("Holiday on this day already exists");
      return;
    }

    if (isDuplicateName) {
      alert("Holiday with same name already exists");
      return;
    }

    // make api call to save holiday
    axios
      .post(baseURL + "/holidays/save", newHoliday)
      .then(() => {
        toast.success(
          `Holiday "${newHoliday.name}" on ${moment(newHoliday.date).format(
            "DD-MM-YYYY"
          )} is saved`,
          {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 5000,
            className: "custom-toast",
          }
        );
      })
      .catch((error) => {
        console.error("Error adding holiday:", error);
      });
    setActionOccurred(true);
    setIsModalOpen(false);
  }

  // handle delete action
  function handleDelete(id) {
    axios
      .delete(`${baseURL}/holidays/remove/${id}`)
      .then(() => {
        toast.success("Holiday deleted successfully", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 5000,
          className: "custom-toast",
        });

        setActionOccurred(true);
      })
      .catch((error) => {
        console.error("Error deleting holiday: ", error);
      });
  }
  // handle edit action
  function handleEditHoliday(editedHoliday) {
    axios
      .put(
        `${baseURL}/holidays/update/${editedHoliday._id}`,
        editedHoliday
      )
      .then(() => {
        toast.success(`Holiday "${editedHoliday.name}" updated`, {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 5000,
          className: "custom-toast",
        });

        setActionOccurred(true);
        console.log("Holiday updated successfully");
      })
      .catch((error) => {
        console.error("Error updating holiday:", error);
      });
    setIsEditModalOpen(false);
  }

  return (
    <>
      <Navbar />
      <br />
      <div className="pt-3 mt-1">
        <SideNav />
      </div>

      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-2 col-md-1"></div>
          <div className="col-sm-10 col-md-11">
          <h1 className="mb-4" style={{ fontWeight: "350", verticalAlign: 'middle' }}>Manage Holidays </h1>

            <table className="table">
              <thead>
                <tr>
                  <th style={{ backgroundColor: "#3f68d9", color: "white" }}>
                    Occasion
                  </th>
                  <th style={{ backgroundColor: "#3f68d9", color: "white" }}>
                    Date
                  </th>
                  <th style={{ backgroundColor: "#3f68d9", color: "white" }}>
                    Modify
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Render holidays in table */}
                {currentHolidays.map((holiday) => (
                  <tr key={holiday._id}>
                    <td>{holiday.name}</td>
                    <td>{moment(holiday.date).format("DD-MM-YYYY")}</td>
                    <td>
                      <FiEdit
                        className="clickable-cell"
                        style={{ color: "blue", opacity: "0.5" }}
                        onClick={() =>
                          handleEdit(holiday._id, holiday.name, holiday.date)
                        }
                      />
                    </td>
                  </tr>
                ))}
                {/* Render empty rows if rows are less then 6 */}
                {currentHolidays.length < holidaysPerPage &&
                  Array(holidaysPerPage - currentHolidays.length)
                    .fill()
                    .map((_, index) => (
                      <tr key={`empty-${index}`}>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                      </tr>
                    ))}
              </tbody>
            </table>
            {/* Hide add button and pagination buttons when modals are open */}
            {!isModalOpen && !isEditModalOpen && (
              <div className="d-flex justify-content-between">
                <div>
                  <button
                    className="btn btn-outline-dark float-lefts"
                    onClick={openModal}
                  >
                    Add Holiday
                  </button>
                </div>
                {/* Pagination logic */}
                <nav>
                  <ul
                    className="pagination"
                    style={{ justifyContent: "flex-end" }}
                  >
                    {Array(Math.ceil(holidays.length / holidaysPerPage))
                      .fill(0)
                      .map((_, index) => (
                        <li
                          key={index}
                          className={`page-item ${index + 1 === currentPage ? "active" : ""
                            }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(index + 1)}
                            style={{
                              height: "1.3rem",
                              fontSize: "0.8rem",
                              padding: "0 0.5rem",
                            }}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                  </ul>
                </nav>
              </div>
            )}
            {/* Add holiday modal */}
            <HolidayInputModal
              isOpen={isModalOpen}
              onRequestClose={closeModal}
              onSubmit={handleSubmit}
              holidays={holidays}
            />
            {/* Edit Holiday modal */}
            <HolidayEditModal
              isOpen={isEditModalOpen}
              onRequestClose={closeEditModal}
              holidayData={editHolidayData}
              onEdit={handleEditHoliday}
              onDelete={handleDelete}
              holidays={holidays}
            />
            {/* Toast styling */}
            <ToastContainer
              style={{
                height: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Holidays;

Modal.setAppElement("#root"); // Set the root element for accessibility
