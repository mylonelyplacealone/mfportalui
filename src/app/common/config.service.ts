export class ConfigClass{

  constructor() { }

  public static mfGetDataUrl:string = "https://api.mfapi.in/mf/";//"http://localhost:8010/proxy/mf/"
  public static mfSearchListURL:string = "https://api.mfapi.in/mf/search?q=";//"http://localhost:8010/proxy/mf/search?q="
  //https://www.mfapi.in/
  public static restAPIURL:string = "https://mfportalrestapi.onrender.com/api/";
  // public static restAPIURL:string = "http://localhost:5000/api/";

  //Stoc URL Below
  public static stockAPIURL:string = "https://priceapi.moneycontrol.com/pricefeed/nse/equitycash/";
  public static indexAPIURL:string = "https://priceapi.moneycontrol.com/pricefeed/notapplicable/inidicesindia/in%3B";
}
