import { Box } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

type Props = {};

const Logo = (props: Props) => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        ml: "-18px",
        px: 0,
      }}
    >
      <Link href={"/"} style={{ display: "flex" }}>
        <Image
          src={
            "https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e6faf73568658154dae_SitemarkDefault.svg"
          }
          style={{ height: "auto" }}
          alt="logo of sitemark"
          width={140}
          height={50}
        />
      </Link>
    </Box>
  );
};

export default Logo;
