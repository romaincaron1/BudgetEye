import MUIDataTable from "mui-datatables";
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

const muiCache = createCache({
  key: "mui-datatables",
  prepend: true
});


const Table = (props) => {
    const [responsive] = useState("vertical");
    const [tableBodyHeight] = useState("400px");
    const [tableBodyMaxHeight] = useState("");
    const [searchBtn] = useState(true);
    const [downloadBtn] = useState(true);
    const [printBtn] = useState(true);
    const [viewColumnBtn] = useState(true);
    const [filterBtn] = useState(true);

    const columns = props.columns
    
    const options = {
    textLabels: {
        body: {
            noMatch: "Désolé, il n'y a pas de données correspondante",
            toolTip: "Sort",
            columnHeaderTooltip: column => `Sort for ${column.label}`
        },
        pagination: {
            next: "Prochaine Page",
            previous: "Precedente Page",
            rowsPerPage: "Lignes par page:",
            displayRows: "sur",
        },
        toolbar: {
            search: "Rechercher",
            downloadCsv: "Export CSV",
            print: "Imprimer",
            viewColumns: "Afficher certaines colonnes",
            filterTable: "Filtres",
        },
        filter: {
            all: "Tous",
            title: "FILTRES",
            reset: "RESET",
        },
        viewColumns: {
            title: "Afficher les colonnes",
            titleAria: "Montrer/Cacher les colonnes",
        },
        selectedRows: {
            text: "lignes(s) sélectionée(s)",
            delete: "Supprimer",
            deleteAria: "Supprimer les lignes sélectionées",
        },
        },
    search: searchBtn,
    download: downloadBtn,
    print: printBtn,
    viewColumns: viewColumnBtn,
    filter: filterBtn,
    selectableRows: false,
    filterType: "dropdown",
    responsive,
    tableBodyHeight,
    tableBodyMaxHeight,
    onRowsDelete:(e)=>{},
    onTableChange: (action, state) => {

    }
    };

    return (
      
        <CacheProvider value={muiCache}>
      <ThemeProvider theme={createTheme()}>
        <MUIDataTable
          // title={"Liste des " + props.name}
          data={props.data}
          columns={columns}
          options={options}
          
        />
      </ThemeProvider>
    </CacheProvider>
    );
};

export default Table;