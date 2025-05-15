"use client";
import Footer from "@/@core/components/Home/Footer";
import Header from "@/@core/components/Home/Header";
import Main from "@/@core/components/Home/Main";
import Head from "next/head";
import { Row } from "react-bootstrap";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Bytebank</title>
        <meta name="description" content="Site Bytebank" />
        <link rel="icon" href="/icon.svg" type="image/svg" />
      </Head>
      <Row style={{ overflowX: "hidden" }}>
        <Header />
        <Main />
        <Footer />
      </Row>
    </>
  );
}
