import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DefaultScreenHeaderComponent } from '@shared';
import { DividerModule } from 'primeng/divider';
import { PreCodeComponent } from '../widget/pre-code/pre-code.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-store-call-documentation',
  standalone: true,
  imports: [PreCodeComponent,DividerModule, DefaultScreenHeaderComponent,TranslateModule],
  templateUrl: './store-call-documentation.component.html',
  styleUrl: './store-call-documentation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class StoreCallDocumentationComponent {
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

  call_type = `
    call_type:"incoming"
    call_type:"outgoing"
    call_type:"missed"
    call_type:"voiceMail"
    call_type:"rejected"
    call_type:"blocked"
    call_type:"answeredExternally"
  `;

  storeCall = `
    curl
    -X POST
    -H 'Content-Type: application/json'
    -H 'Accept: application/json'
    -H 'User-Agent: YourWebsite/Web'
    -H 'Authorization: <TOKEN_TYPE> <ACCESS_TOKEN>'
    -d '{"mobile_number":"", "call_type":"", "duration":"" , "started_at":"", "platform_id":"3"}'
    "https://testing.8xcrm.com/api/v1/activities/activities/storeMobileCall"
  `;

  storeCallExample = `
    curl
    -X POST
    -H 'Content-Type: application/json'
    -H 'Accept: application/json'
    -H 'User-Agent: YourWebsite/Web'
    -H 'Authorization: <TOKEN_TYPE> <ACCESS_TOKEN>'
    -d '{"mobile_number":"01007788368", "call_type":"incoming", "duration":"110" , "started_at":"1585148093399", "platform_id":"3"}'
    "https://testing.8xcrm.com/api/v1/activities/activities/storeMobileCall"
  `;

  storeCallPHP = `
    <?php

    // Init the connection
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, "https://testing.8xcrm.com/api/v1/activities/activities/storeMobileCall");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, "{\"mobile_number\":\"\", \"call_type\":\"\", \"duration\":\"\" , \"started_at\":\"\", \"platform_id\":\"3\"}");

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

  storeCallPHPExample = `
    <?php

    // Init the connection
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, "https://testing.8xcrm.com/api/v1/activities/activities/storeMobileCall");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, "{\"mobile_number\":\"01007788368\", \"call_type\":\"incoming\", \"duration\":\"110\" , \"started_at\":\"1585148093399\", \"platform_id\":\"3\"}");

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
