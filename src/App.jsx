import { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import {
  TextField,
  FormControl,
  Button,
  Container,
  Grid,
  Autocomplete,
  Box,
  Typography,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [countryData, setCountryData] = useState([]);

  // console.log('countries ==>', countries)
  // console.log('searchQuery ==>', searchQuery)
  // console.log('countryData ==>', countryData)

  const columns = [
    { field: "CountryName", headerName: "Country Name", width: 200 },
    { field: "CapitalCity", headerName: "Capital City", width: 200 },
    {
      field: "CountryFlag",
      headerName: "Country Flag",
      width: 200,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="Country Flag"
          style={{ width: 30, height: 20 }}
        />
      ),
    },
  ];

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const res = await axios.get("https://restcountries.com/v3.1/all");
      setCountries(res.data);
      setCountryData(res.data.map(countryToRow));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const countryToRow = (country) => ({
    id: uuidv4(),
    CountryName: country.name.common,
    CapitalCity: country.capital?.[0] || "N/A",
    CountryFlag: country.flags?.png,
  });

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setCountryData(countries.map(countryToRow));
      toast.error("Please select a country");
    } else {
      const filteredCountry = countries.filter(
        (country) =>
          country.name.common.toLowerCase() === searchQuery.toLowerCase()
      );
      setCountryData(filteredCountry.map(countryToRow));
    }
  };

  const clearSearch = () => {
    setSearchQuery(""); // Clear the search query
    setCountryData(countries.map(countryToRow)); // Show all countries
  };

  return (
    <Container sx={{ marginTop: "90px" }}>
      <ToastContainer position="top-center" />

      <Box
        boxShadow={4}
        p={3}
        sx={{ borderRadius: 3, backgroundColor: "white" }}
      >
        <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
          Country Search
        </Typography>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} sm={12} md={6}>
            <FormControl fullWidth>
              <Autocomplete
                options={countries.map((option) => option.name.common)}
                value={searchQuery || null}
                onChange={(event, newValue) => setSearchQuery(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Country"
                    variant="outlined"
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} md={3}>
            <FormControl fullWidth>
              <Button
                style={{ height: 55 }}
                variant="contained"
                onClick={handleSearch}
              >
                Search
              </Button>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={3}>
            <FormControl fullWidth>
              <Button
                style={{ height: 55 }}
                variant="contained"
                color="error"
                onClick={clearSearch}
              >
                Clear
              </Button>
            </FormControl>
          </Grid>
        </Grid>
        <div style={{ height: 500, width: "100%", marginTop: "15px" }}>
          <DataGrid rows={countryData} columns={columns} />
        </div>
      </Box>
    </Container>
  );
}

export default App;
