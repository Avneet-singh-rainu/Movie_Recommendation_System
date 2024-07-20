import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const SkeletonMovie = () => {
  return (
    <Stack spacing={1}>
      <Skeleton
        variant="text"
        width={210}
        height={40}
        sx={{ bgcolor: "grey.800" }}
      />
      <Skeleton
        variant="text"
        width={210}
        height={40}
        sx={{ bgcolor: "grey.800" }}
      />
      <Skeleton
        variant="text"
        width={210}
        height={40}
        sx={{ bgcolor: "grey.800" }}
      />
    </Stack>
  );
};

export default SkeletonMovie;
