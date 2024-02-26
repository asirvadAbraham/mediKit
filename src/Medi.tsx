import React, { useState } from "react";
import axios from "axios";
import styled from "@emotion/styled";

type DataType = {
  name: string;
  id: string;
};

const Container = styled.div`
  .table-header {
    display: flex;
  }

  .table-row {
    display: flex;
  }

  .table-column,
  .table-cell {
    border: 1px solid black;
  }

  .name-column {
    width: 80px;
  }
  .id-column {
    width: 40px;
  }
`;

export const Medi = () => {
  const [formData, setFormData] = useState<DataType>({
    name: "",
    id: "",
  });
  const [resultantData, setResultantData] = useState<DataType[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isId = false
  ) => {
    let updatedValue = { ...formData };
    if (isId) {
      updatedValue = { ...updatedValue, id: e.target.value };
    } else {
      updatedValue = { ...updatedValue, name: e.target.value };
    }
    setFormData(updatedValue);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        "http://localhost:5000/submit_data",
        formData
      );
      console.log(result);
      setResultantData(result.data as DataType[]);
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error submitting data. Please try again.");
    }
  };

  return (
    <Container className="main-container">
      <h1>Submit Data</h1>
      <form onSubmit={handleSubmit}>
        <label>Doctor's Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => handleChange(e)}
          required
        />
        <label>Doctor's id:</label>
        <input
          name="age"
          value={formData.id}
          onChange={(e) => handleChange(e, true)}
          required
        />
        <button type="submit">Submit</button>
      </form>
      {resultantData?.length ? (
        <>
          <div className="table-header">
            <div className="table-column id-column">Id</div>
            <div className="table-column name-column">Name</div>
          </div>
          {resultantData?.map((item) => (
            <div className="table-row">
              <div className="table-cell id-column">{item.id}</div>
              <div className="table-cell name-column">{item.name}</div>
            </div>
          ))}
        </>
      ) : (
        <h1>No Data</h1>
      )}
    </Container>
  );
};
