export const videos = [
    {
      name: "Boston's Graduation Speech",
      link: "https://youtu.be/STfuafuLPMQ",
      linkId: "STfuafuLPMQ",
    },
    {
      name: "Dad's 50th birthday video",
      link: "https://youtu.be/XlMXuOlI5lk",
      linkId: "XlMXuOlI5lk",
    },
    {
      name: "Chris & Brooke 2",
      link: "https://www.youtube.com/watch?v=Pt5_Hff6uD4",
      linkId: "Pt5_Hff6uD4",
    },
    {
      name: "Scott & Kelly",
      link: "https://www.youtube.com/watch?v=NE-rFr4ApPM",
      linkId: "NE-rFr4ApPM",
    },
    {
      name: "Because You Loved Me",
      link: "https://www.youtube.com/watch?v=IAR-x_2PDR8",
      linkId: "IAR-x_2PDR8",
    },
    {
      name: "Chris & Brooke 1",
      link: "https://www.youtube.com/watch?v=Y9UpzbCptoQ",
      linkId: "Y9UpzbCptoQ",
    },
    {
      name: "Mom",
      link: "https://www.youtube.com/watch?v=8-ztMCJ8xc8",
      linkId: "8-ztMCJ8xc8",
    },
    {
      name: "Godfrey 2",
      link: "https://www.youtube.com/watch?v=rs5QgNcRdhU",
      linkId: "rs5QgNcRdhU",
    },  
    {
      name: "Mom 2",
      link: "https://www.youtube.com/watch?v=RGlpjlr8rrY",
      linkId: "RGlpjlr8rrY",
    }, 
    {
      name: "Bojack's movie",
      link: "https://www.youtube.com/watch?v=W7Ho-iaKSjo",
      linkId: "W7Ho-iaKSjo",
    }, 
    {
      name: "Stuart, Rachel and the Boys",
      link: "https://www.youtube.com/watch?v=NeUXsD5a30w",
      linkId: "NeUXsD5a30w",
    }, 
    {
      name: "The Gordon & Janet Smith Family Video Production Company",
      link: "https://www.youtube.com/watch?v=itSD5B5RAfg",
      linkId: "itSD5B5RAfg",
    }, 
    {
      name: "Brotherly Love",
      link: "https://www.youtube.com/watch?v=_XXMJG-Z8Mk",
      linkId: "_XXMJG-Z8Mk",
    }, 
    {
      name: "Marie",
      link: "https://www.youtube.com/watch?v=HsO6o6e2YYM",
      linkId: "HsO6o6e2YYM",
    }, 
    {
      name: "Tears in Heaven",
      link: "https://www.youtube.com/watch?v=8_POpC689OY",
      linkId: "8_POpC689OY",
    }, 
    {
      name: "Kimbo Christmas",
      link: "https://www.youtube.com/watch?v=HNZzy_X_4SU",
      linkId: "HNZzy_X_4SU",
    }
  ];

  export function getVideoByLinkId(linkId: string | null) {
    if (!linkId) return null;
    return videos.find((video) => video.linkId === linkId);
  }