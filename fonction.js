// Fonction pour envoyer le formulaire
function sendForm() {
  // Récupération des données du formulaire
  var companyName = document.querySelector("input[name='company_name']").value;
  var siret = document.querySelector("input[name='siret']").value;
  var codeNaf = document.querySelector("input[name='code_naf']").value;
  var turnover = document.querySelector("input[name='turnover']").value;
  var years = document.querySelector("input[name='years']").value;
  var email = document.querySelector("input[name='email']").value;

  // Appel de la fonction de calcul de l'empreinte carbone
  calculateCarbonFootprint(companyName, siret, codeNaf, turnover, years, email);
}

// Fonction pour calculer l'empreinte carbone
function calculateCarbonFootprint(companyName, siret, codeNaf, turnover, years, email) {
  // Importation des bibliothèques
  const pandas = require("pandas");
  const requests = require("requests");

  // Récupération du facteur d'émission
  const response = requests.get(
    "https://api.data.gouv.fr/api/v1/indicateurs/emissions_gaz_effet_de_serre/valeurs/?code_naf={}".format(codeNaf)
  );
  const data = response.json();
  const emissionFactor = data["valeur"];

  // Calcul de l'empreinte carbone
  const carbonFootprint = emissionFactor * turnover;

  // Calcul de l'empreinte carbone par tonne de chiffre d'affaires
  const carbonFootprintPerTurnover = carbonFootprint / turnover;

  // Calcul de l'empreinte carbone par année
  const carbonFootprintPerYear = carbonFootprint / years;

  // Envoi des résultats par e-mail
  const subject = "Résultats du calcul de l'empreinte carbone";
  const message = """
  Bonjour,

  Voici les résultats du calcul de l'empreinte carbone de votre entreprise :

  Empreinte carbone totale : {} tonnes de CO2
  Empreinte carbone par tonne de chiffre d'affaires : {} tonnes de CO2
  Empreinte carbone par année : {} tonnes de CO2

  Cordialement,
  [Votre nom]
  """.format(carbonFootprint, carbonFootprintPerTurnover, carbonFootprintPerYear);
  sendEmail(subject, message, email);

  // Affichage des résultats
  const results = document.querySelector(".results");
  results.innerHTML = `
  <h2>Résultats</h2>
  <p>Empreinte carbone totale : ${carbonFootprint} tonnes de CO2</p>
  <p>Empreinte carbone par tonne de chiffre d'affaires : ${carbonFootprintPerTurnover} tonnes de CO2</p>
  <p>Empreinte carbone par année : ${carbonFootprintPerYear} tonnes de CO2</p>
  `;
}
