// Import necessary libraries 
import React, { useEffect, useState } from "react";
import moment from "moment";
import Calendar from "react-calendar";
import Modal from "react-modal";

// Edit Modal
const HolidayEditModal = ({
  isOpen,
  onRequestClose,
  holidayData,
  onEdit,
  onDelete,
  holidays,
}) => {
  // various states to edit holiday
  const [name, setName] = useState(holidayData ? holidayData.name : "");
  const [date, setDate] = useState(
    holidayData ? new Date(holidayData.date) : new Date()
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isModified, setIsModified] = useState(false);

  //Set the baseURL
  const baseURL = process.env.NODE_ENV === 'production' ? 'https://3.108.23.98/API' : 'http://localhost:4000';

  // functions to handle events
  const handleNameChange = (e) => {
    setName(e.target.value);
    setIsModified(true);
  };

  const handleOpenCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setIsCalendarOpen(false);
    setIsModified(true);
  };

  const handleEdit = () => {
    const editedHoliday = {
      _id: holidayData._id,
      name: name,
      date: date.toISOString(),
    };
    const confirmed = window.confirm(
      "Are you sure you want to update this holiday?"
    );
    if (!confirmed) {
      return;
    }
    onEdit(editedHoliday);
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this holiday?"
    );
    if (confirmed) {
      onDelete(holidayData._id);
      onRequestClose();
    }
  };

  useEffect(() => {
    setName(holidayData ? holidayData.name : "");
    setDate(holidayData ? new Date(holidayData.date) : new Date());
    setIsModified(false);
  }, [holidayData]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Holiday"
      shouldCloseOnOverlayClick={false}
      style={{
        content: {
          width: "60%",
          minWidth: "400px",
          maxHeight: "521px",
          margin: "auto",
          overflow: "hidden",
          top: "120px",
          bottom: "80px"
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        },
      }}
    >
      <h2 className="mb-5" style={{ fontWeight: "350", verticalAlign: 'middle' }}>Edit Holiday</h2>
      <div className="form-group row" style={{ transform: "scale(0.9)" }}>
        <label className="col-2 col-form-label">Occasion:</label>
        <div className="col-8">
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={handleNameChange}
            style={{ fontSize: "0.85rem" }}
          />
        </div>
      </div>
      <div
        className="form-group row"
        style={{ height: "40px", transform: "scale(0.9)", marginTop: "5%" }}
      >
        <label className="col-2 col-form-label">Date:</label>
        <div className="col-4">
          <input
            type="text"
            className="form-control"
            value={moment(date).format("DD-MM-YYYY")}
            style={{ fontSize: "0.85rem" }}
            readOnly
          ></input>
        </div>
        <div className="col-1">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={handleOpenCalendar}
            style={{ marginLeft: "10%" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-calendar-date"
              viewBox="0 0 16 16"
            >
              <path d="M6.445 11.688V6.354h-.633A12.6 12.6 0 0 0 4.5 7.16v.695c.375-.257.969-.62 1.258-.777h.012v4.61h.675zm1.188-1.305c.047.64.594 1.406 1.703 1.406 1.258 0 2-1.066 2-2.871 0-1.934-.781-2.668-1.953-2.668-.926 0-1.797.672-1.797 1.809 0 1.16.824 1.77 1.676 1.77.746 0 1.23-.376 1.383-.79h.027c-.004 1.316-.461 2.164-1.305 2.164-.664 0-1.008-.45-1.05-.82h-.684zm2.953-2.317c0 .696-.559 1.18-1.184 1.18-.601 0-1.144-.383-1.144-1.2 0-.823.582-1.21 1.168-1.21.633 0 1.16.398 1.16 1.23z" />
              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
            </svg>
          </button>
        </div>
        {isCalendarOpen && (
          <div
            className="calendar-container"
            style={{
              transform: "scale(0.9)",
              marginTop: "-9px",
              marginLeft: "20%",
            }}
          >
            <Calendar
              value={date}
              onChange={handleDateChange}
              tileContent={({ date }) => {
                const holiday = holidays.find((h) =>
                  moment(h.date).isSame(date, "day")
                );
                return holiday ? (
                  <div
                    className="holiday-marker"
                    style={{ marginTop: "-8px", transform: "scale(0.5)" }}
                  >
                    {holiday.name}
                  </div>
                ) : null;
              }}
              tileClassName={({ date }) =>
                holidays.some((holiday) =>
                  moment(holiday.date).isSame(date, "day")
                )
                  ? "holiday-tile"
                  : null
              }
            />
          </div>
        )}
      </div>
      <div
        className="modal-footer2"
        style={{ padding: "1% 2% 1%", background: "#f0f0f0" }}
      >
        <button
          className="btn btn-primary btn-sm"
          onClick={handleEdit}
          style={{ marginRight: "1%" }}
          disabled={!isModified}
        >
          Update
        </button>
        <button className="btn btn-outline-danger btn-sm" onClick={handleDelete}>
          Delete
        </button>
        <button
          className="btn btn-outline-dark btn-sm"
          onClick={onRequestClose}
          style={{ marginLeft: "1%" }}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default HolidayEditModal;
