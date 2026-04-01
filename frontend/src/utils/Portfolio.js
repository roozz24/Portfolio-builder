const defaultPortfolio = {
  id: "",
  title: "My Portfolio",
  theme: {
    mode: "light",
    primaryColor: "#000000"
  },
  sections: [
    {
      id: "hero-1",
      type: "Hero",
      data: {
        name: "Your Name",
        title: "React Developer",
        tagline: "I build clean UI"
      }
    },
    {
      id: "about-1",
      type: "About",
      data: {
        description: "Write about yourself"
      }
    },
    {
      id: "projects-1",
      type: "Projects",
      data: [
        {
          title: "",
          description: "",
          link: ""
        }
      ]
    },
    {
      id: "skills-1",
      type: "Skills",
      data: [""]
    }
  ]
};

export default defaultPortfolio;