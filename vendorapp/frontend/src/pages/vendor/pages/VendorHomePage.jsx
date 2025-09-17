import { Grid } from "@mui/material";
import SalesCard from "../components/SalesCard";
import SalesChart from "../components/SalesChart";

const VendorHomePage = () => {
  return (
    <div style={{ margin: "30px" }}>
      <Grid container spacing={3} sx={{ padding: "9px" }}>
        <Grid item xs={12} sm={6} md={3}>
          <SalesCard
            title="Weekly Sales"
            total={71}
            color="primary"
            icon={"ant-design:carry-out-filled"}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SalesCard
            title="Added to Invoice"
            total={23}
            color="success"
            icon={"ant-design:book-outlined"}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SalesCard
            title="Ongoing Bookings"
            total={17}
            color="warning"
            icon={"material-symbols:data-exploration"}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SalesCard
            title="Cancelled Bookings"
            total={13}
            color="error"
            icon={"material-symbols:free-cancellation-rounded"}
          />
        </Grid>

        <Grid item xs={12} lg={6}>
          <SalesChart type="line" />
        </Grid>

        <Grid item xs={12} lg={6}>
          <SalesChart type="bar" />
        </Grid>
      </Grid>
    </div>
  );
};

//   return (
//     <h1>
//       <center>Dashboard UI</center>
//     </h1>
//   );
// };
export default VendorHomePage;
