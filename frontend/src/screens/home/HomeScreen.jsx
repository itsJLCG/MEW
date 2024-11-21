import styled from "styled-components";
import Hero from "../../components/home/Hero";
import Featured from "../../components/home/Featured";
import NewArrival from "../../components/home/NewArrival";
import SavingZone from "../../components/home/SavingZone";

const HomeScreenWrapper = styled.main``;

const HomeScreen = () => {
  return (
    <HomeScreenWrapper>
      <Hero />
      <Featured />
      <NewArrival />
    </HomeScreenWrapper>
  );
};

export default HomeScreen;
