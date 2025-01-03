package com.themba.currencyconverter.currency_converter.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;

import org.json.JSONObject;
import java.math.BigDecimal;
import okhttp3.OkHttpClient;
import okhttp3.Response;




@Controller
public class CurrencyController {

    // Run Page
    @GetMapping("/")
    public String getConverterPage(Model model) throws IOException {
        return "converter"; // return html page
    }

    // Get api token
    @Value("${key.file.path}")
    private String filePath;

    @GetMapping("/getApiKey")
    @ResponseBody
    public String getApiKeys() {
        try {
            return new String(Files.readAllBytes(Paths.get(filePath)));
        } catch (IOException e) {
            e.printStackTrace();
            return "Error: API Key not found.";
        }
    }

    OkHttpClient client = new OkHttpClient();
    

    // Get available currency names
    @GetMapping("/getCurrency")
    public ResponseEntity<HashMap<String, Double>> getCurrencyName() throws IOException {

        // Store currency data here
        HashMap<String, Double> currencyPairs = new HashMap<>();

        String jsonData = "";

        // Setting the URL
        String url = "https://v6.exchangerate-api.com/v6/" + getApiKeys() + "/latest/ZAR";

        okhttp3.Request request = new okhttp3.Request.Builder().url(url).build();

        // Making the request
        try (Response response = client.newCall(request).execute()) {
            jsonData = response.body().string();
            JSONObject object = new JSONObject(jsonData);
            if (jsonData.contains("conversion_rates")) {

                JSONObject conversionRates = object.getJSONObject("conversion_rates");
                Double valueAsDouble = 0.0;

                for (Object key : conversionRates.keySet()) {
                    String keyStr = (String) key;
                    Object keyValue = conversionRates.get(keyStr);
                    BigDecimal bigDecimal = new BigDecimal(keyValue.toString());
                    // System.out.println(conversionRates.get(keyStr));
                    if (keyValue instanceof Number) {
                        bigDecimal = new BigDecimal(keyValue.toString());
                        valueAsDouble = bigDecimal.doubleValue(); // Convert from Object to Double
                    }

                    // System.out.println(valueAsDouble);
                    // Add new pair to HashMap
                    currencyPairs.put(keyStr, valueAsDouble);
                }
            }
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok(currencyPairs);
    }
}
