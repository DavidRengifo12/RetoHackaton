import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import {
  FaShoppingBag,
  FaChartLine,
  FaRobot,
  FaShoppingCart,
  FaMobileAlt,
  FaTools,
  FaChartBar,
  FaArrowRight,
  FaCheckCircle,
  FaTshirt,
  FaHome,
  FaDownload,
  FaQrcode,
} from "react-icons/fa";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();

  const servicios = [
    {
      icon: FaShoppingBag,
      title: "Gestión de Inventario",
      desc: "Control total de tu stock de ropa",
    },
    {
      icon: FaChartLine,
      title: "Análisis de Ventas",
      desc: "Reportes detallados de rendimiento",
    },
    {
      icon: FaRobot,
      title: "Asistentes Inteligentes",
      desc: "IA para consultas rápidas",
    },
    {
      icon: FaShoppingCart,
      title: "E-commerce Integrado",
      desc: "Ventas online conectadas",
    },
    {
      icon: FaMobileAlt,
      title: "App Móvil",
      desc: "Gestiona desde cualquier lugar",
    },
    {
      icon: FaTools,
      title: "Soporte Técnico",
      desc: "Asistencia cuando la necesites",
    },
  ];

  const caracteristicas = [
    {
      icon: FaTshirt,
      title: "Catálogo de Productos",
      text: "Organiza tu colección de ropa fácilmente",
    },
    {
      icon: FaChartBar,
      title: "Reportes en Tiempo Real",
      text: "Visualiza tus ventas y tendencias",
    },
    {
      icon: FaRobot,
      title: "Asistentes IA",
      text: "Consulta información con lenguaje natural",
    },
  ];

  return (
    <div className="bg-white" style={{ width: "100%", overflowX: "hidden" }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 shadow-sm sticky-top">
        <Container>
          <Link
            to="/"
            className="navbar-brand d-flex align-items-center text-decoration-none"
          >
            <div
              className="me-2 d-flex align-items-center justify-content-center"
              style={{
                width: "32px",
                height: "32px",
                backgroundColor: "#002f19",
                borderRadius: "6px",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <FaChartLine className="text-white" />
            </div>
            <span className="fw-bold fs-4" style={{ color: "#2E2E2E" }}>
              InventarioPro
            </span>
          </Link>

          <div className="navbar-nav d-none d-lg-flex flex-row me-auto ms-5">
            <Link
              className="nav-link px-3 fw-medium"
              to="/"
              style={{ color: "#002f19" }}
            >
              Inicio
            </Link>
            <Link
              className="nav-link px-3 fw-medium"
              to="/shop"
              style={{ color: "#002f19" }}
            >
              Tienda
            </Link>
            <Link
              className="nav-link px-3 fw-medium"
              to="/agents"
              style={{ color: "#002f19" }}
            >
              Asistentes IA
            </Link>
          </div>

          <div className="d-flex gap-2">
            {isAuthenticated ? (
              <>
                <Button
                  onClick={() => navigate("/dashboard")}
                  variant="link"
                  className="text-decoration-none fw-medium"
                  style={{ color: "#002f19" }}
                >
                  Dashboard
                </Button>
                <Button
                  onClick={() => navigate("/shop")}
                  className="px-4 py-2 fw-medium"
                  style={{
                    backgroundColor: "#002f19",
                    border: "none",
                    borderRadius: "6px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#001a0e";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#002f19";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Ir a Tienda
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => navigate("/login")}
                  variant="link"
                  className="text-decoration-none fw-medium"
                  style={{ color: "#002f19" }}
                >
                  Ingresar
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 fw-medium"
                  style={{
                    backgroundColor: "#002f19",
                    border: "none",
                    borderRadius: "6px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#001a0e";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#002f19";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Crear cuenta
                </Button>
              </>
            )}
          </div>
        </Container>
      </nav>

      {/* Hero Section */}
      <section
        className="py-5"
        style={{
          backgroundColor: "#F5F7FA",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          paddingTop: "120px",
          paddingBottom: "120px",
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="pe-lg-5">
              <div
                className="mb-5 px-5 py-3 d-inline-block rounded-pill"
                style={{
                  backgroundColor: "#E8F5E8",
                  color: "#002f19",
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  border: "1px solid #D4E8D4",
                  animation: "fadeIn 0.6s ease-in",
                }}
              >
                ✨ Bienvenido a Nuestro Sistema Inteligente
              </div>

              <h1
                className="display-2 fw-bold mb-5"
                style={{
                  color: "#2E2E2E",
                  animation: "fadeIn 0.8s ease-in",
                  fontSize: "5rem",
                  lineHeight: "1.2",
                }}
              >
                Gestiona tu Tienda{" "}
                <span style={{ color: "#002f19" }}>con Inteligencia</span>
              </h1>
              <p
                className="fs-3 text-muted mb-5"
                style={{
                  animation: "fadeIn 1s ease-in",
                  lineHeight: "1.8",
                  fontSize: "1.5rem",
                }}
              >
                Controla tu inventario, analiza tus ventas y toma decisiones
                inteligentes con nuestro sistema todo-en-uno diseñado para
                tiendas de moda.
              </p>
              <div
                className="d-flex flex-wrap gap-3"
                style={{ animation: "fadeIn 1.2s ease-in" }}
              >
                <Button
                  onClick={() =>
                    navigate(isAuthenticated ? "/dashboard" : "/register")
                  }
                  className="px-4 py-3 fw-medium d-flex align-items-center"
                  style={{
                    backgroundColor: "#002f19",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "1.4rem",
                    padding: "20px 50px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#001a0e";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#002f19";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Comenzar Ahora
                  <FaArrowRight className="ms-2" />
                </Button>
                {isAuthenticated ? (
                  <Button
                    onClick={() => navigate("/dashboard")}
                    variant="outline"
                    className="px-4 py-3 fw-medium d-flex align-items-center"
                    style={{
                      color: "#002f19",
                      borderColor: "#002f19",
                      borderRadius: "6px",
                      fontSize: "1.4rem",
                      padding: "20px 50px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#F5F7FA";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <FaHome className="me-2" />
                    Ir al Dashboard
                  </Button>
                ) : (
                  <Button
                    onClick={() => navigate("/login")}
                    variant="outline"
                    className="px-4 py-3 fw-medium"
                    style={{
                      color: "#002f19",
                      borderColor: "#002f19",
                      borderRadius: "6px",
                      fontSize: "1.4rem",
                      padding: "20px 50px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#F5F7FA";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    Iniciar Sesión
                  </Button>
                )}
              </div>
            </Col>
            <Col lg={6} className="text-center mt-4 mt-lg-0">
              <div className="position-relative">
                <img
                  src="https://cdn.pixabay.com/photo/2020/01/26/20/14/computer-4795762_1280.jpg"
                  alt="Sistema de gestión"
                  className="img-fluid rounded-3"
                  style={{
                    maxHeight: "800px",
                    width: "100%",
                    objectFit: "cover",
                    filter: "brightness(1.1)",
                    animation: "fadeIn 1.4s ease-in",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section
        className="py-5"
        style={{
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          paddingTop: "100px",
          paddingBottom: "100px",
        }}
      >
        <Container>
          <div className="text-center mb-5">
            <h2
              className="fw-bold mb-4"
              style={{ color: "#2E2E2E", fontSize: "2.5rem" }}
            >
              Todo lo que Necesitas para tu Tienda
            </h2>
            <p className="text-muted fs-5">
              Un sistema completo diseñado específicamente para tiendas de moda
              y ropa
            </p>
          </div>

          <Row className="g-4">
            {caracteristicas.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Col md={4} key={idx}>
                  <Card
                    className="border-0 text-center h-100 p-4"
                    style={{
                      transition: "all 0.3s ease",
                      animation: `fadeIn ${0.6 + idx * 0.2}s ease-in`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-8px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 16px rgba(0,0,0,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div className="mb-4">
                      <div
                        className="d-inline-flex align-items-center justify-content-center rounded-circle"
                        style={{
                          width: "100px",
                          height: "100px",
                          backgroundColor: "#E8F5E8",
                        }}
                      >
                        <Icon className="fa-3x" style={{ color: "#002f19" }} />
                      </div>
                    </div>
                    <Card.Body className="p-0">
                      <h5
                        className="fw-bold mb-3"
                        style={{ color: "#2E2E2E", fontSize: "1.5rem" }}
                      >
                        {feature.title}
                      </h5>
                      <p className="text-muted" style={{ fontSize: "1.1rem" }}>
                        {feature.text}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>

      {/* Services Section */}
      <section
        className="py-5"
        style={{
          backgroundColor: "#F5F7FA",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          paddingTop: "100px",
          paddingBottom: "100px",
        }}
      >
        <Container>
          <div className="text-center mb-5">
            <h2
              className="fw-bold mb-4"
              style={{ color: "#2E2E2E", fontSize: "2.5rem" }}
            >
              Funcionalidades Potentes
            </h2>
            <p className="text-muted fs-5">
              Herramientas diseñadas para hacer crecer tu negocio de moda
            </p>
          </div>

          <Row className="g-4">
            {servicios.map((servicio, idx) => {
              const Icon = servicio.icon;
              return (
                <Col md={4} key={idx}>
                  <Card
                    className="border-0 text-center h-100 p-4 bg-white"
                    style={{
                      transition: "all 0.3s ease",
                      animation: `fadeIn ${0.8 + idx * 0.15}s ease-in`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-8px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 24px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 2px 4px rgba(0,0,0,0.1)";
                    }}
                  >
                    <div className="mb-4">
                      <div
                        className="d-inline-flex align-items-center justify-content-center rounded-circle"
                        style={{
                          width: "100px",
                          height: "100px",
                          backgroundColor: "#E8F5E8",
                        }}
                      >
                        <Icon className="fa-3x" style={{ color: "#002f19" }} />
                      </div>
                    </div>
                    <Card.Body className="p-0">
                      <h5
                        className="fw-bold mb-3"
                        style={{ color: "#2E2E2E", fontSize: "1.5rem" }}
                      >
                        {servicio.title}
                      </h5>
                      <p className="text-muted" style={{ fontSize: "1.1rem" }}>
                        {servicio.desc}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>

      {/* Why Choose Us Section */}
      <section
        className="py-5"
        style={{
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          paddingTop: "100px",
          paddingBottom: "100px",
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h2
                className="fw-bold mb-4"
                style={{ color: "#2E2E2E", fontSize: "2.5rem" }}
              >
                ¿Por Qué Elegirnos?
              </h2>
              <p className="text-muted mb-5 fs-5" style={{ lineHeight: "1.6" }}>
                La solución perfecta para tiendas de moda que buscan eficiencia
                y crecimiento.
              </p>
              <div>
                {[
                  "Control total de tu inventario",
                  "Análisis de ventas en tiempo real",
                  "Asistentes inteligentes con IA",
                  "Interfaz intuitiva y fácil de usar",
                  "Soporte técnico especializado",
                ].map((item, idx) => (
                  <div key={idx} className="d-flex align-items-start mb-3">
                    <FaCheckCircle
                      className="me-3 mt-1"
                      style={{ color: "#002f19", fontSize: "1.5rem" }}
                    />
                    <span
                      className="text-muted"
                      style={{ fontSize: "1.2rem", lineHeight: "1.6" }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </Col>
            <Col lg={6}>
              <div
                className="p-4 rounded-3"
                style={{
                  backgroundColor: "#E8F5E8",
                  border: "1px solid #D4E8D4",
                }}
              >
                <Row className="g-4">
                  <Col sm={6} className="text-center">
                    <div
                      className="display-4 fw-bold mb-2"
                      style={{ color: "#002f19" }}
                    >
                      100%
                    </div>
                    <p className="text-muted">Satisfacción</p>
                  </Col>
                  <Col sm={6} className="text-center">
                    <div
                      className="display-4 fw-bold mb-2"
                      style={{ color: "#002f19" }}
                    >
                      24/7
                    </div>
                    <p className="text-muted">Disponible</p>
                  </Col>
                  <Col sm={6} className="text-center">
                    <div
                      className="display-4 fw-bold mb-2"
                      style={{ color: "#002f19" }}
                    >
                      10+
                    </div>
                    <p className="text-muted">Años de experiencia</p>
                  </Col>
                  <Col sm={6} className="text-center">
                    <div
                      className="display-4 fw-bold mb-2"
                      style={{ color: "#002f19" }}
                    >
                      500+
                    </div>
                    <p className="text-muted">Clientes felices</p>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* App Móvil QR Section */}
      <section
        className="py-5"
        style={{
          backgroundColor: "#F5F7FA",
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          paddingTop: "100px",
          paddingBottom: "100px",
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="text-center mb-4 mb-lg-0">
              <div
                className="d-inline-block p-4 rounded-4 bg-white"
                style={{
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <img
                  src="/img/qr-movil.jpeg"
                  alt="QR Code App Móvil"
                  className="img-fluid"
                  style={{
                    maxWidth: "500px",
                    width: "100%",
                    height: "auto",
                    borderRadius: "12px",
                  }}
                />
              </div>
              <div className="mt-4">
                <Button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = "/img/qr-movil.jpeg";
                    link.download = "qr-movil-inventariopro.jpeg";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="px-4 py-2 fw-medium d-inline-flex align-items-center"
                  style={{
                    backgroundColor: "#002f19",
                    border: "none",
                    borderRadius: "6px",
                    color: "white",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#001a0e";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#002f19";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <FaDownload className="me-2" />
                  Descargar QR
                </Button>
              </div>
            </Col>
            <Col lg={6}>
              <div className="ps-lg-5">
                <div className="mb-3">
                  <FaQrcode
                    className="mb-3"
                    style={{ color: "#002f19", fontSize: "3rem" }}
                  />
                </div>
                <h2
                  className="fw-bold mb-4"
                  style={{ color: "#2E2E2E", fontSize: "3.5rem" }}
                >
                  Descarga Nuestra App Móvil
                </h2>
                <p
                  className="text-muted mb-4 fs-4"
                  style={{ lineHeight: "1.8", fontSize: "1.4rem" }}
                >
                  Escanea el código QR con tu dispositivo móvil para descargar
                  nuestra aplicación y gestiona tu tienda desde cualquier lugar.
                </p>
                <div className="mb-4">
                  <div className="d-flex align-items-start mb-3">
                    <FaCheckCircle
                      className="me-3 mt-1"
                      style={{ color: "#002f19", fontSize: "1.5rem" }}
                    />
                    <div>
                      <h6 className="fw-bold mb-1" style={{ color: "#2E2E2E" }}>
                        Acceso Rápido
                      </h6>
                      <p className="text-muted mb-0">
                        Escanea el QR y accede instantáneamente a tu cuenta
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-start mb-3">
                    <FaCheckCircle
                      className="me-3 mt-1"
                      style={{ color: "#002f19", fontSize: "1.5rem" }}
                    />
                    <div>
                      <h6 className="fw-bold mb-1" style={{ color: "#2E2E2E" }}>
                        Gestión en Movimiento
                      </h6>
                      <p className="text-muted mb-0">
                        Controla tu inventario y ventas desde tu móvil
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-start">
                    <FaCheckCircle
                      className="me-3 mt-1"
                      style={{ color: "#002f19", fontSize: "1.5rem" }}
                    />
                    <div>
                      <h6 className="fw-bold mb-1" style={{ color: "#2E2E2E" }}>
                        Sincronización en Tiempo Real
                      </h6>
                      <p className="text-muted mb-0">
                        Todos tus datos se sincronizan automáticamente
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section
        className="py-5"
        style={{
          backgroundColor: "#002f19",
          paddingTop: "100px",
          paddingBottom: "100px",
        }}
      >
        <Container>
          <div className="text-center text-white">
            <h2 className="fw-bold mb-4" style={{ fontSize: "2.5rem" }}>
              ¿Listo para Transformar tu Negocio?
            </h2>
            <p
              className="fs-4 mb-5"
              style={{ color: "#E8F5E8", lineHeight: "1.6" }}
            >
              Comienza hoy mismo y lleva tu tienda de moda al siguiente nivel
            </p>
            <Button
              onClick={() =>
                navigate(isAuthenticated ? "/dashboard" : "/register")
              }
              className="px-5 py-3 fw-medium d-inline-flex align-items-center"
              style={{
                backgroundColor: "#ffffff",
                color: "#002f19",
                border: "none",
                borderRadius: "6px",
                fontSize: "1.4rem",
                padding: "20px 50px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F5F7FA";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Empezar Gratis
              <FaArrowRight className="ms-2" />
            </Button>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-4" style={{ backgroundColor: "#263238" }}>
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <div className="d-flex align-items-center text-white mb-2">
                <div
                  className="me-2 d-flex align-items-center justify-content-center"
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: "#002f19",
                    borderRadius: "6px",
                  }}
                >
                  <FaTshirt className="text-white" />
                </div>
                <span className="fw-bold fs-5">Sistema de Inventario</span>
              </div>
              <p className="text-white small mb-0" style={{ opacity: 0.9 }}>
                La solución completa para gestionar tu tienda de moda de manera
                inteligente y eficiente.
              </p>
            </Col>
            <Col md={3}>
              <h6 className="text-white fw-bold mb-2">Enlaces Rápidos</h6>
              <div className="d-flex flex-column">
                <Link
                  to="/"
                  className="text-white text-decoration-none small mb-1"
                  style={{ opacity: 0.9 }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.9")}
                >
                  Inicio
                </Link>
                <Link
                  to="/agents"
                  className="text-white text-decoration-none small mb-1"
                  style={{ opacity: 0.9 }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.9")}
                >
                  Asistentes IA
                </Link>
                {!isAuthenticated && (
                  <>
                    <Link
                      to="/login"
                      className="text-white text-decoration-none small mb-1"
                      style={{ opacity: 0.9 }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.opacity = "1")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.opacity = "0.9")
                      }
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      to="/register"
                      className="text-white text-decoration-none small"
                      style={{ opacity: 0.9 }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.opacity = "1")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.opacity = "0.9")
                      }
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            </Col>
            <Col md={3}>
              <h6 className="text-white fw-bold mb-2">Características</h6>
              <div className="d-flex flex-column">
                <span
                  className="text-white small mb-1"
                  style={{ opacity: 0.9 }}
                >
                  Gestión de Inventario
                </span>
                <span
                  className="text-white small mb-1"
                  style={{ opacity: 0.9 }}
                >
                  Análisis de Ventas
                </span>
                <span
                  className="text-white small mb-1"
                  style={{ opacity: 0.9 }}
                >
                  Asistentes Inteligentes
                </span>
                <span className="text-white small" style={{ opacity: 0.9 }}>
                  Soporte 24/7
                </span>
              </div>
            </Col>
          </Row>
          <hr className="border-white my-3" style={{ opacity: 0.3 }} />
          <div
            className="text-center text-white small"
            style={{ opacity: 0.9 }}
          >
            <p className="mb-0">
              &copy; {new Date().getFullYear()} Sistema de Inventario. Todos los
              derechos reservados.
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;
