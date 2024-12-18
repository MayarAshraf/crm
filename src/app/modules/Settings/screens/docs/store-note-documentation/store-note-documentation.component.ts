import { ChangeDetectionStrategy, Component } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { DefaultScreenHeaderComponent } from "@shared";
import { DividerModule } from "primeng/divider";
import { PreCodeComponent } from "../widget/pre-code/pre-code.component";

@Component({
  selector: "app-store-note-documentation",
  standalone: true,
  imports: [PreCodeComponent, DividerModule, DefaultScreenHeaderComponent, TranslateModule],
  templateUrl: "./store-note-documentation.component.html",
  styleUrl: "./store-note-documentation.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class StoreNoteDocumentationComponent {
  OAuth = `
      -client_id=2
      -client_secret=eLIDs4VCjt9lUICMRTCX1E2h6Ll0bCZ5j5SKjmfG
  `;
  accessToken = `
    -curl
    -X POST
    -H 'Content-Type: application/json'
    -H 'Accept: application/json'
    -H 'User-Agent: YourWebsite/Web'
    -d '{"grant_type":"password", "client_id":"2","client_secret":"eLIDs4VCjt9lUICMRTCX1E2h6Ll0bCZ5j5SKjmfG",
    "username":"<USERNAME>", "password":"<PASSWORD>"}'
    "https://testing.8xcrm.com/oauth/token"
  `;

  afterAccessToken = `
      <?php

      // Init the connection
      $ch = curl_init();

      curl_setopt($ch, CURLOPT_URL, "https://testing.8xcrm.com/oauth/token");
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
      curl_setopt($ch, CURLOPT_POST, 1);
      curl_setopt($ch, CURLOPT_POSTFIELDS, "{\"grant_type\":\"password\", \"client_id\":\"2\", \"client_secret\":\"eLIDs4VCjt9lUICMRTCX1E2h6Ll0bCZ5j5SKjmfG\" , \"username\":\"support@8worx.com\", \"password\":\"123456\"}");

      // Append the headers
      $headers = array();
      $headers[] = "Content-Type: application/json";
      $headers[] = "Accept: application/json";
      $headers[] = "User-Agent: YourWebsite/Web";
      curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

      // Get the connection
      $result = curl_exec($ch);

      // Prepare the data
      $data = json_decode($result, true);
      $token_type = $data["token_type"];
      $expires_in = $data["expires_in"];
      $access_token = $data["access_token"];
      $refresh_token = $data["refresh_token"];

      // Handle the error
      if (curl_errno($ch)) {
        echo "Error:" . curl_error($ch);
      }

      // Close the connection
      curl_close($ch);
  `;

  Parameters = `
    mobile_number: Caller/Called number
    call_type: Call type like incoming, outgoing, ... call
    duration: Call duration in seconds
    started_at: UNIX timestamp in milliseconds
    platform_id: Constant equals 3
  `;

  storeLead = `
      -curl
      -X POST
      -H 'Content-Type: application/json'
      -H 'Accept: application/json'
      -H 'User-Agent: YourWebsite/Web'
      -H 'Authorization: <TOKEN_TYPE> <ACCESS_TOKEN>'
      -d '{"title":"", "first_name":"", "middle_name":"" , "last_name":"", "full_name":"", "description":"", "company":"", "address":"", "zip_code":"", "birthdate":"", "phones":[{"phone":"", "country_code":""}], "social_accounts":[{"social_account":"", "account_type_id": 22}], "form_id":""}'
      "https://testing.8xcrm.com/api/v1/lead_generation/web_form_routings/storeLead"
  `;

  storeLeadExample = `
    -curl
    -X POST
    -H 'Content-Type: application/json'
    -H 'Accept: application/json'
    -H 'User-Agent: YourWebsite/Web'
    -H 'Authorization: <TOKEN_TYPE> <ACCESS_TOKEN>'
    -d '{"title":"Mr", "first_name":"Mohamed", "middle_name":"" , "last_name":"Alansary", "full_name":"Mohamed Alansary", "description":"", "company":"8X Egypt", "address":"Egypt, Cairo, Maadi", "zip_code":"", "birthdate":"", "phones":[{"phone":"01007788368", "country_code":"EG"}], "social_accounts":[{"social_account":"hello@8worx.com", "account_type_id": 22}], "form_id":"000001"}'
    "https://testing.8xcrm.com/api/v1/lead_generation/web_form_routings/storeLead"
  `;

  storeLeadPHP = `
    <?php

    // Init the connection
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, "https://testing.8xcrm.com/api/v1/lead_generation/web_form_routings/storeLead");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, "{\"title\":\"\", \"first_name\":\"\", \"middle_name\":\"\" , \"last_name\":\"\", \"full_name\":\"\", \"description\":\"\", \"company\":\"\", \"address\":\"\", \"zip_code\":\"\", \"birth_date\":\"\", \"phones\":[{\"phone\":\"\", \"country_code\":\"\"}], \"social_accounts\":[{\"social_account\":\"\", \"account_type_id\":\"22\"}], \"form_id\":\"\"}");

    // Append the headers
    $headers = array();
    $headers[] = "Content-Type: application/json";
    $headers[] = "Accept: application/json";
    $headers[] = "User-Agent: YourWebsite/Web";
    $headers[] = "Authorization: <TOKEN_TYPE> <ACCESS_TOKEN>";
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    // Get the connection
    $result = curl_exec($ch);

    // Prepare the data
    $data = json_decode($result, true);

    // Handle the error
    if (curl_errno($ch)) {
      echo "Error:" . curl_error($ch);
    }

    // Close the connection
    curl_close($ch);
  `;

  storeLeadPHPExample = `
    <?php

    // Init the connection
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, "https://testing.8xcrm.com/api/v1/lead_generation/web_form_routings/storeLead");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, "{\"title\":\"Mr\", \"first_name\":\"Mohamed\", \"middle_name\":\"\" , \"last_name\":\"Alansary\", \"full_name\":\"Mohamed Alansary\", \"description\":\"\", \"company\":\"8X Egypt\", \"address\":\"Egypt, Cairo, Maadi\", \"zip_code\":\"\", \"birth_date\":\"\", \"phones\":[{\"phone\":\"01007788368\", \"country_code\":\"EG\"}], \"social_accounts\":[{\"social_account\":\"hello@8worx.com\", \"account_type_id\":\"22\"}], \"form_id\":\"000001\"}");

    // Append the headers
    $headers = array();
    $headers[] = "Content-Type: application/json";
    $headers[] = "Accept: application/json";
    $headers[] = "User-Agent: YourWebsite/Web";
    $headers[] = "Authorization: <TOKEN_TYPE> <ACCESS_TOKEN>";
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    // Get the connection
    $result = curl_exec($ch);

    // Prepare the data
    $data = json_decode($result, true);

    // Handle the error
    if (curl_errno($ch)) {
      echo "Error:" . curl_error($ch);
    }

    // Close the connection
    curl_close($ch);
  `;
}
