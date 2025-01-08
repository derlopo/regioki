import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { CompanyDetailsTableComponent } from '@regio-ki/company-details-table';
import { CompanyService, ConfirmDialogConfig } from '@regio-ki/regioki-core';
import { AppsService } from '@regio-ki/regioki-core';
import { forkJoin, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MaterialModule } from '@regio-ki/material';
import { LineChartComponent, PieChartComponent } from '@regio-ki/d3-graphs';
import { SearchableTableComponent } from '@regio-ki/searchable-table';
import { ICompany } from 'libs/regioki-core/src/lib/models/interfaces';
import { TableConfig } from '@regio-ki/regioki-core';
import { environment } from '@env/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@regio-ki/confirmation-dialog';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'lib-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    CompanyDetailsTableComponent,
    LineChartComponent,
    PieChartComponent,
    SearchableTableComponent,
  ],
  template: `
    <div class="dashboard-container">
      <div class="row cards-row">
        <!-- First Row: Three Columns of Cards -->
        <div class="col">
          <mat-card
            class="dashboard-card pointer"
            appearance="outlined"
            (click)="navigateToDetails()"
          >
            <div class="content-wrapper">
              <div class="text-content">
                <h3>Companies</h3>
                <h1>{{ companyCount }}</h1>
              </div>
              <div class="logo-content">
                <!-- <div mat-card-avatar class="example-header-image"> -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="92"
                  height="92"
                  viewBox="0 0 92 92"
                  fill="none"
                >
                  <circle
                    cx="46"
                    cy="46"
                    r="46"
                    fill="#008080"
                    fill-opacity="0.08"
                  />
                  <g clip-path="url(#clip0_213_1664)">
                    <path
                      d="M24 24L49 27.5814V68H24V24Z"
                      fill="#008080"
                      fill-opacity="0.14"
                    />
                    <path
                      d="M23 25.3416C23.2324 24.7039 23.4923 24.094 24.0398 23.6435C24.9406 22.9008 25.9505 22.931 27.019 23.0977C32.0706 23.8887 37.1258 24.6568 42.1798 25.4333C43.8797 25.6942 45.5807 25.9454 47.277 26.2244C48.9193 26.4949 49.8369 27.6048 49.8393 29.3004C49.8441 32.7254 49.8405 36.1504 49.8405 39.5755C49.8405 39.7554 49.8405 39.9366 49.8405 40.1769C50.582 40.3315 51.3211 40.4897 52.0615 40.6383C56.8543 41.5996 61.6448 42.573 66.4412 43.5102C67.8177 43.7795 68.637 44.5741 69 45.9038V66.5554C68.9006 66.8332 68.8227 67.1231 68.6969 67.3876C68.2669 68.2885 67.5002 68.7535 66.5742 69.001H25.4258C24.6819 68.7909 23.9907 68.4805 23.5594 67.7994C23.333 67.4419 23.1845 67.0325 23 66.646V25.3416ZM47.9095 67.0482V66.4637C47.9095 54.1488 47.9095 41.8327 47.9095 29.5178C47.9095 29.3825 47.9131 29.246 47.9059 29.1108C47.8795 28.5649 47.616 28.24 47.0853 28.1374C46.6014 28.0432 46.1126 27.9695 45.6239 27.8958C39.1623 26.9164 32.6995 25.9382 26.2368 24.9575C25.3479 24.8222 24.9095 25.1942 24.9095 26.1169C24.9083 39.3678 24.9083 52.6198 24.9095 65.8707C24.9095 66.7149 25.2748 67.0711 26.1242 67.0736C27.4862 67.0772 28.8482 67.0748 30.2115 67.0736C30.3432 67.0736 30.475 67.0591 30.6583 67.0482C30.6583 66.8501 30.6583 66.6738 30.6583 66.4963C30.6583 63.855 30.6535 61.2138 30.6595 58.5726C30.6643 56.6898 31.8538 55.4869 33.7178 55.4809C35.4991 55.4748 37.2804 55.4772 39.0617 55.4809C40.9987 55.4845 42.1547 56.6523 42.1571 58.6136C42.1607 61.2392 42.1571 63.8659 42.1571 66.4914C42.1571 66.6678 42.1571 66.8453 42.1571 67.0482H47.9071H47.9095ZM49.8669 67.0748H50.4023C55.5079 67.0748 60.6146 67.0748 65.7201 67.0748C66.7851 67.0748 67.0905 66.7704 67.0905 65.7076C67.0905 59.3974 67.0905 53.0872 67.0905 46.777C67.0905 45.806 66.8785 45.5475 65.9525 45.3628C61.5957 44.4944 57.2401 43.6237 52.8844 42.7566C51.8902 42.5585 50.8947 42.3689 49.8669 42.1684V67.0736V67.0748ZM40.25 67.0566V66.6533C40.25 63.9686 40.25 61.2838 40.25 58.5991C40.25 57.7453 39.905 57.4071 39.0413 57.4059C37.3055 57.4047 35.5709 57.4059 33.8352 57.4059C32.8972 57.4059 32.5929 57.7079 32.5929 58.6462C32.5917 61.3008 32.5929 63.9553 32.5929 66.6098C32.5929 66.7535 32.6109 66.8972 32.6217 67.0566H40.2512H40.25Z"
                      fill="#008080"
                    />
                    <path
                      d="M49 41L68 45V68H49V41Z"
                      fill="#008080"
                      fill-opacity="0.14"
                    />
                    <path
                      d="M31.6288 34.2156C31.031 34.2156 30.4333 34.2205 29.8355 34.2156C29.1851 34.2096 28.761 33.8352 28.7502 33.2688C28.7394 32.6939 29.1503 32.3002 29.8008 32.2954C31.0107 32.2869 32.2206 32.2869 33.4317 32.2954C34.0833 32.299 34.499 32.6867 34.4954 33.2567C34.4918 33.8256 34.0678 34.2096 33.4221 34.2156C32.8243 34.2217 32.2266 34.2169 31.6288 34.2169V34.2156Z"
                      fill="#008080"
                    />
                    <path
                      d="M31.6407 38.0897C32.2529 38.0897 32.8662 38.0812 33.4783 38.0921C34.0929 38.1042 34.5002 38.4991 34.4942 39.0546C34.4894 39.6078 34.0737 40.0051 33.4628 40.0099C32.2373 40.0184 31.013 40.0184 29.7876 40.0099C29.1754 40.0063 28.7585 39.6138 28.7502 39.0619C28.7406 38.4882 29.1527 38.1005 29.8031 38.0909C30.4153 38.0812 31.0286 38.0885 31.6407 38.0897Z"
                      fill="#008080"
                    />
                    <path
                      d="M31.6179 43.8872C32.2456 43.8872 32.8733 43.8775 33.4998 43.8908C34.0916 43.9029 34.4857 44.2881 34.4929 44.8304C34.5 45.3859 34.088 45.8014 33.4842 45.8074C32.2444 45.8183 31.0045 45.8171 29.7647 45.8074C29.1609 45.8026 28.7452 45.3907 28.75 44.8364C28.7536 44.2772 29.1549 43.8992 29.7814 43.8884C30.3936 43.8775 31.0069 43.8859 31.6191 43.8859L31.6179 43.8872Z"
                      fill="#008080"
                    />
                    <path
                      d="M31.6239 51.6069C31.0118 51.6069 30.3985 51.6141 29.7863 51.6045C29.1742 51.596 28.7585 51.2059 28.7501 50.654C28.7417 50.0936 29.143 49.6927 29.7612 49.6878C31.001 49.677 32.2409 49.677 33.4807 49.6878C34.0952 49.6927 34.5013 50.096 34.4941 50.6528C34.487 51.2059 34.0725 51.59 33.4603 51.6081C33.446 51.6081 33.4304 51.6081 33.416 51.6081C32.8183 51.6081 32.2205 51.6081 31.6227 51.6081L31.6239 51.6069Z"
                      fill="#008080"
                    />
                    <path
                      d="M41.1769 34.2161C40.5792 34.2161 39.9814 34.2221 39.3848 34.2149C38.7392 34.2064 38.3367 33.82 38.3438 33.233C38.3522 32.6618 38.7344 32.3007 39.3753 32.2959C40.5851 32.2862 41.795 32.2874 43.0049 32.2959C43.6578 32.2995 44.0783 32.6823 44.0807 33.2487C44.0831 33.8188 43.659 34.2101 43.0145 34.2173C42.4024 34.2246 41.7903 34.2185 41.1769 34.2185V34.2161Z"
                      fill="#008080"
                    />
                    <path
                      d="M41.2225 38.0909C41.8346 38.0909 42.4479 38.0824 43.0601 38.0933C43.6722 38.1054 44.0855 38.5051 44.0807 39.0546C44.0759 39.609 43.6614 40.0075 43.0493 40.0111C41.825 40.0196 40.5996 40.0196 39.3753 40.0111C38.7524 40.0075 38.3523 39.6283 38.3439 39.0643C38.3355 38.4701 38.7224 38.1018 39.3861 38.0909C39.9982 38.0812 40.6103 38.0885 41.2237 38.0897L41.2225 38.0909Z"
                      fill="#008080"
                    />
                    <path
                      d="M41.202 45.8112C40.5899 45.8112 39.9765 45.8184 39.3644 45.8088C38.7475 45.7991 38.3474 45.4151 38.3438 44.8511C38.3414 44.275 38.7211 43.8958 39.3524 43.891C40.5923 43.8801 41.8321 43.8801 43.0719 43.891C43.6793 43.897 44.0938 44.3125 44.0818 44.862C44.0698 45.4163 43.6553 45.7991 43.0396 45.8088C42.4275 45.8172 41.8153 45.8112 41.202 45.8112Z"
                      fill="#008080"
                    />
                    <path
                      d="M41.202 51.6081C40.5899 51.6081 39.9765 51.6153 39.3644 51.6057C38.7475 51.596 38.3474 51.212 38.3438 50.648C38.3414 50.0719 38.7211 49.6927 39.3524 49.6878C40.5923 49.677 41.8321 49.677 43.0719 49.6878C43.6793 49.6939 44.0938 50.1093 44.0818 50.6588C44.0698 51.2132 43.6553 51.59 43.0396 51.6069C43.0252 51.6069 43.0096 51.6069 42.9953 51.6069C42.3975 51.6069 41.7998 51.6069 41.2032 51.6069L41.202 51.6081Z"
                      fill="#008080"
                    />
                    <path
                      d="M58.452 51.6081C57.8399 51.6081 57.2265 51.6153 56.6144 51.6057C55.9975 51.596 55.5974 51.212 55.5938 50.648C55.5914 50.0719 55.9711 49.6927 56.6024 49.6878C57.8422 49.677 59.0821 49.677 60.3219 49.6878C60.9293 49.6939 61.3438 50.1093 61.3318 50.6588C61.3198 51.2132 60.9053 51.59 60.2896 51.6069C60.2752 51.6069 60.2596 51.6069 60.2453 51.6069C59.6475 51.6069 59.0498 51.6069 58.4532 51.6069L58.452 51.6081Z"
                      fill="#008080"
                    />
                    <path
                      d="M58.4269 57.4036C57.8292 57.4036 57.2314 57.4096 56.6348 57.4024C55.9892 57.3939 55.5867 57.0075 55.5938 56.4205C55.6022 55.8493 55.9844 55.4882 56.6253 55.4834C57.8351 55.4737 59.045 55.4749 60.2549 55.4834C60.9078 55.487 61.3283 55.8698 61.3307 56.4362C61.3331 57.0063 60.909 57.3976 60.2645 57.4048C59.6524 57.4121 59.0403 57.406 58.4269 57.406V57.4036Z"
                      fill="#008080"
                    />
                    <path
                      d="M58.4969 61.2771C59.1091 61.2771 59.7224 61.2674 60.3345 61.2795C60.9251 61.2916 61.324 61.6744 61.336 62.2131C61.3492 62.7686 60.9371 63.1901 60.3333 63.1961C59.0791 63.207 57.8237 63.2082 56.5695 63.1961C55.9873 63.1901 55.6004 62.7855 55.6016 62.2348C55.6016 61.6756 55.9729 61.2964 56.5719 61.2831C57.214 61.2686 57.856 61.2795 58.4981 61.2795L58.4969 61.2771Z"
                      fill="#008080"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_213_1664">
                      <rect
                        width="46"
                        height="46"
                        fill="white"
                        transform="translate(23 23)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <!-- </div> -->
              </div>
            </div>
          </mat-card>
        </div>
        <div class="col">
          <mat-card
            class="dashboard-card pointer"
            appearance="outlined"
            (click)="navigateToAiApps()"
          >
            <div class="content-wrapper">
              <div class="text-content">
                <h3>AI Apps</h3>
                <h1>{{ appCount }}</h1>
              </div>
              <div class="logo-content">
                <!-- <div mat-card-avatar class="example-header-image"> -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="92"
                  height="92"
                  viewBox="0 0 92 92"
                  fill="none"
                >
                  <circle
                    cx="46"
                    cy="46"
                    r="46"
                    fill="#008080"
                    fill-opacity="0.08"
                  />
                  <g clip-path="url(#clip0_213_1600)">
                    <path
                      d="M46.0307 23.0014C51.8921 23.0014 57.7534 22.9975 63.6148 23.0027C66.2653 23.0053 68.2966 24.5716 68.8583 27.0496C68.9589 27.4912 68.9954 27.9549 68.9954 28.4095C69.0033 40.1322 69.0033 51.8536 68.9994 63.5764C68.9994 66.2595 67.4318 68.3012 64.9394 68.8603C64.4978 68.9596 64.0328 68.9936 63.5795 68.9936C51.8568 69.0001 40.1354 69.0014 28.4126 68.9975C25.2292 68.9975 23.0072 66.7872 23.0046 63.6142C22.998 51.8758 22.9993 40.1374 23.0033 28.399C23.0046 25.2195 25.2187 23.0079 28.397 23.004C34.274 22.9975 40.1524 23.0027 46.0294 23.0027L46.0307 23.0014ZM66.8936 31.3774C66.6284 31.3774 66.4351 31.3774 66.2418 31.3774C61.1968 31.3774 56.1532 31.3839 51.1083 31.3748C48.0751 31.3696 45.7616 29.6975 44.7793 26.8289C44.6369 26.4122 44.4684 26.002 44.3678 25.5761C44.2803 25.2064 44.1078 25.098 43.7303 25.098C38.6201 25.1111 33.5111 25.1046 28.4009 25.1072C26.35 25.1072 25.1116 26.3468 25.1103 28.399C25.1077 40.1374 25.1077 51.8745 25.1103 63.6129C25.1103 65.6364 26.3539 66.8891 28.3669 66.8891C40.121 66.8917 51.8751 66.8917 63.6305 66.8878C63.9387 66.8878 64.2523 66.8669 64.5527 66.8055C65.6827 66.5743 66.9119 65.4783 66.908 63.5685C66.8805 53.0228 66.8949 42.4757 66.8949 31.93C66.8949 31.7693 66.8949 31.6086 66.8949 31.3761L66.8936 31.3774ZM66.9197 29.2703C66.8858 28.6316 66.9263 28.0372 66.8087 27.4755C66.4965 25.9941 65.2842 25.1098 63.6514 25.1085C58.0878 25.1046 52.5243 25.1072 46.9595 25.1072C46.8001 25.1072 46.6407 25.1072 46.4265 25.1072C46.5284 25.4324 46.6172 25.6911 46.6904 25.955C47.2756 28.0685 49.0456 29.3134 51.2912 29.2886C56.2838 29.2338 61.2765 29.2716 66.2692 29.2716H66.921L66.9197 29.2703Z"
                      fill="#008080"
                    />
                    <rect
                      x="24"
                      y="24"
                      width="44"
                      height="44"
                      rx="5"
                      fill="#008080"
                      fill-opacity="0.14"
                    />
                    <path
                      d="M36.5699 47.0557C36.583 46.9146 36.5961 46.8362 36.5974 46.7566C36.6 46.5293 36.5974 46.302 36.5974 46.0028H34.2003C32.591 46.0028 32.4094 45.8199 32.4094 44.1949C32.4094 43.7704 32.3963 43.3458 32.4146 42.9213C32.4446 42.2773 32.8666 41.837 33.44 41.8227C34.0266 41.8083 34.4746 42.2629 34.5099 42.9265C34.5256 43.2348 34.5125 43.5431 34.5125 43.8853H36.5961C36.5961 42.7005 36.4628 41.4883 37.4256 40.5399C38.3726 39.6072 39.5627 39.7195 40.7566 39.7378V37.649C40.4235 37.649 40.1165 37.6608 39.8109 37.6464C39.1407 37.6151 38.6874 37.1827 38.6888 36.5949C38.6901 36.007 39.146 35.5681 39.8161 35.5498C40.4692 35.5315 41.1224 35.5276 41.7755 35.5511C42.4627 35.5759 42.8572 35.9913 42.865 36.6785C42.8754 37.6726 42.8676 38.6666 42.8676 39.6973H44.9498C44.9498 39.5353 44.9498 39.3655 44.9498 39.1944C44.9498 37.6765 44.9485 36.1572 44.9511 34.6393C44.9511 34.1429 45.1314 33.7471 45.6187 33.546C46.0249 33.3774 46.439 33.4323 46.6924 33.7602C46.8949 34.0201 47.0308 34.4003 47.0386 34.7308C47.0752 36.1991 47.0543 37.6686 47.0543 39.1382C47.0543 39.3159 47.0543 39.4922 47.0543 39.7012H49.1365C49.1365 38.7947 49.1365 37.8868 49.1365 36.9789C49.1365 35.8829 49.4722 35.5459 50.5643 35.5446C51.1025 35.5446 51.642 35.5315 52.1802 35.5485C52.8543 35.5694 53.3088 35.9979 53.3141 36.587C53.3206 37.1775 52.8686 37.6125 52.1985 37.6464C51.8928 37.6608 51.5845 37.649 51.2488 37.649V39.7326C52.4336 39.73 53.6289 39.6007 54.5733 40.536C55.523 41.4765 55.4224 42.6652 55.4028 43.8788H57.489C57.489 43.5849 57.4799 43.2831 57.4903 42.9814C57.5151 42.2851 57.9567 41.8109 58.5589 41.8227C59.1441 41.8344 59.5725 42.2942 59.5908 42.967C59.6078 43.5875 59.6065 44.208 59.5908 44.8285C59.5725 45.6005 59.165 45.995 58.393 46.0002C57.4172 46.0067 56.44 46.0015 55.4342 46.0015V47.0544C55.6158 47.0544 55.7895 47.0544 55.9646 47.0544C57.4498 47.0544 58.9364 47.0518 60.4216 47.0557C61.2041 47.0583 61.6861 47.4711 61.6718 48.1112C61.6587 48.733 61.1793 49.134 60.4308 49.1353C58.9285 49.1379 57.4263 49.1353 55.9254 49.1353H55.4316V50.1882C56.3826 50.1882 57.31 50.1869 58.2362 50.1882C59.2447 50.1908 59.5895 50.5357 59.5934 51.5402C59.5961 52.0954 59.6052 52.6506 59.5895 53.2058C59.5699 53.9164 59.1441 54.3553 58.5171 54.3435C57.9175 54.3331 57.5151 53.8942 57.4903 53.2084C57.4799 52.9171 57.489 52.6244 57.489 52.3005H55.4094C55.4015 53.4696 55.5413 54.6819 54.5812 55.6329C53.6354 56.5695 52.4441 56.4558 51.2488 56.4611V58.5394C51.5898 58.5394 51.9124 58.5302 52.2338 58.542C52.8634 58.5642 53.3115 58.9992 53.3154 59.5779C53.3193 60.1526 52.8738 60.5981 52.2416 60.6138C51.5728 60.6308 50.9026 60.6294 50.2338 60.6151C49.5428 60.5994 49.1457 60.1984 49.1378 59.506C49.1261 58.5132 49.1352 57.5191 49.1352 56.4911H47.053C47.053 56.6674 47.053 56.8399 47.053 57.0123C47.053 58.5145 47.0621 60.0168 47.0491 61.5177C47.0412 62.4073 46.3228 62.9481 45.5952 62.6281C45.0975 62.4099 44.9446 61.9815 44.9459 61.4668C44.9498 59.9972 44.9472 58.5276 44.9472 57.0593C44.9472 56.883 44.9472 56.7053 44.9472 56.4924H42.865C42.865 57.3794 42.865 58.2716 42.865 59.1638C42.865 60.3159 42.5645 60.619 41.4215 60.619C40.8664 60.619 40.3112 60.6294 39.756 60.6125C39.1277 60.5942 38.6796 60.1474 38.6848 59.574C38.6888 58.9966 39.1381 58.5616 39.7678 58.5394C40.0891 58.5276 40.4118 58.5368 40.7566 58.5368V56.4532C40.3843 56.4532 40.0173 56.4545 39.6515 56.4532C37.7587 56.4441 36.5987 55.2854 36.5948 53.3991C36.5948 53.0425 36.5948 52.6858 36.5948 52.2966H34.5125C34.5125 52.5983 34.5217 52.9014 34.5112 53.2044C34.4838 53.9125 34.0618 54.3527 33.4348 54.3396C32.8352 54.3279 32.429 53.8876 32.412 53.2005C32.3963 52.58 32.3976 51.9595 32.412 51.3391C32.4303 50.5801 32.8169 50.1934 33.5694 50.1856C34.5609 50.1751 35.5523 50.183 36.5699 50.183V49.1288C35.8227 49.1288 35.0925 49.1288 34.3623 49.1288C33.4152 49.1288 32.4682 49.1327 31.5211 49.1275C30.8131 49.1236 30.3415 48.7134 30.3284 48.1047C30.3141 47.4763 30.787 47.0518 31.5289 47.0492C33.0142 47.0426 34.5008 47.0466 35.986 47.0466C36.1637 47.0466 36.3413 47.0466 36.5673 47.0466L36.5699 47.0557ZM46.004 54.354C48.1098 54.354 50.2142 54.3553 52.32 54.354C53.1181 54.354 53.3258 54.1424 53.3271 53.3312C53.3284 49.8381 53.3284 46.3464 53.3271 42.8533C53.3271 42.033 53.1051 41.8161 52.2716 41.8148C48.0941 41.8148 43.9153 41.8148 39.7377 41.8148C38.903 41.8148 38.6822 42.0304 38.6822 42.852C38.6809 46.3451 38.6809 49.8368 38.6822 53.3298C38.6822 54.1411 38.8912 54.3527 39.6881 54.354C41.7938 54.3566 43.8983 54.354 46.004 54.354Z"
                      fill="#008080"
                    />
                    <path
                      d="M35.5341 28.2274C35.538 28.8074 35.1121 29.2516 34.5347 29.2659C33.9417 29.2816 33.4662 28.8283 33.461 28.2444C33.457 27.6683 33.9417 27.1863 34.5178 27.1954C35.0821 27.2046 35.5288 27.6579 35.5328 28.2274H35.5341Z"
                      fill="#008080"
                    />
                    <path
                      d="M38.7013 29.2672C38.103 29.2737 37.6524 28.823 37.6563 28.2247C37.6615 27.6578 38.1109 27.2019 38.6739 27.1954C39.2487 27.1888 39.7346 27.6722 39.7281 28.2469C39.7215 28.8087 39.2656 29.2619 38.7 29.2685L38.7013 29.2672Z"
                      fill="#008080"
                    />
                    <path
                      d="M30.3331 29.2671C29.7466 29.2697 29.2684 28.7942 29.2815 28.2182C29.2933 27.6617 29.7622 27.1993 30.32 27.1953C30.8987 27.1914 31.382 27.6774 31.3703 28.2521C31.3598 28.8151 30.9026 29.2632 30.3331 29.2658V29.2671Z"
                      fill="#008080"
                    />
                    <path
                      d="M44.9445 50.2118H42.861C42.861 50.5593 42.8728 50.882 42.8584 51.2046C42.831 51.8225 42.3764 52.2719 41.8029 52.264C41.2464 52.2562 40.7957 51.8212 40.7892 51.2229C40.7761 49.7546 40.7566 48.2851 40.801 46.8181C40.8467 45.2949 42.1582 44.0108 43.6683 43.9272C45.3116 43.8358 46.7825 44.9213 46.9654 46.4902C47.0908 47.5705 47.032 48.6717 47.0503 49.7638C47.0581 50.204 47.0608 50.6455 47.049 51.0858C47.0307 51.8016 46.6192 52.2575 46.0066 52.264C45.3952 52.2693 44.9707 51.8108 44.9472 51.104C44.938 50.8271 44.9459 50.5502 44.9459 50.2132L44.9445 50.2118ZM44.9315 48.0565C44.9315 47.6437 44.9537 47.2857 44.9263 46.9317C44.8871 46.4144 44.4717 46.0317 43.9648 46.0016C43.4697 45.9729 42.9694 46.3178 42.8989 46.8168C42.8414 47.223 42.8871 47.6437 42.8871 48.0565H44.9315Z"
                      fill="#008080"
                    />
                    <path
                      d="M49.1359 48.106C49.1359 47.1288 49.1332 46.1504 49.1359 45.1733C49.1385 44.3843 49.5317 43.9193 50.1848 43.9219C50.8288 43.9245 51.2129 44.3673 51.2142 45.1367C51.2194 47.1079 51.2194 49.0805 51.2142 51.0517C51.2116 51.7963 50.7962 52.2691 50.1718 52.2652C49.5539 52.2613 49.1385 51.7754 49.1346 51.0399C49.1306 50.0628 49.1346 49.0844 49.1346 48.1073L49.1359 48.106Z"
                      fill="#008080"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_213_1600">
                      <rect
                        width="46"
                        height="46"
                        fill="white"
                        transform="translate(23 23)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <!-- </div> -->
              </div>
            </div>
          </mat-card>
        </div>
      </div>
      <div class="row graphs-row">
        <div class="line-chart-col">
          <lib-line-chart></lib-line-chart>
        </div>
        <div class="pie-chart-col">
          <lib-pie-chart></lib-pie-chart>
        </div>
      </div>

      <!-- Reusable Table Testing Row -->
      <div class="row">
        <div class="col">
          <div class="dashboard-table">
            <h3>Registered Companies</h3>
            <div class="searchable-table">
              <lib-searchable-table
                [showFilter]="true"
                [showActions]="true"
                [hasLogo]="true"
                [columns]="columns"
                [dataSource]="dataSource"
                (update)="onUpdate($event)"
                (delete)="onDelete($event)"
                (view)="onView($event)"
                [totalCount]="totalCount"
                [pageSize]="pageSize"
                [pageIndex]="pageIndex"
                (pageChange)="onPageChange($event)"
                (searchChange)="onSearchChange($event)"
                (sortChange)="onSortChange($event)"
              ></lib-searchable-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .graphs-row {
        display: flex;
        gap: 20px;
      }

      mat-card {
        border: none;
        transition: transform 0.5s ease, box-shadow 0.5s ease;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        cursor: pointer;

        &:hover {
          transform: translateY(-10px);
          box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
        }
      }

      .line-chart-col {
        width: 66.67%;
      }
      h3 {
        font-family: Poppins;
        font-size: 20px;
        font-weight: 600;
        line-height: 30px;
      }

      .pie-chart-col {
        width: 33.33%;
      }

      @media (max-width: 768px) {
        .graphs-row {
          flex-direction: column;
        }
        .line-chart-col {
          width: 100%;
        }
        .pie-chart-col {
          width: 100%;
        }
      }
    `,
  ],
})
export class DashboardComponent {
  companyCount = 0;
  appCount = 0;
  subs = new Subscription();
  pageSize = 10;
  pageIndex = 0;
  totalCount = 0;
  filterDesgination = '';
  searchTextSubject = new Subject<any>();
  dataSource = new MatTableDataSource();
  sortField = 'createdAt'; // Default sort field
  sortDirection: 'desc' | 'asc' = 'desc'; // This allows both 'asc' and 'desc'

  columns: TableConfig[] = [
    {
      columnDef: 'id',
      header: 'Company ID',
      cell: (item: ICompany) => item.id || '-',
    },
    {
      columnDef: 'company_name',
      header: 'Companies',
      cell: (item: ICompany) => item.company_name || '-',
    },
    {
      columnDef: 'company_type',
      header: 'Type',
      cell: (item: ICompany) => item.company_type || '-',
    },
    {
      columnDef: 'company_status',
      header: 'Status',
      cell: (item: ICompany) => item.company_status || '-',
    },
  ];

  constructor(
    private companyService: CompanyService,
    private appsService: AppsService,

    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dataSource.data = [];
    const joinSubs = forkJoin([
      this.companyService.findByQuery(
        'populate[logo]=*&populate[Company_TypeID]=*'
      ),
      this.appsService.findByQuery(''),
    ])
      .pipe(
        map(([companies, apps]) => {
          this.companyCount = companies.data.length;
          this.appCount = apps.data.length;
          return companies.data;
        })
      )
      .subscribe((companiesData: any[]) => {
        const transformedData = this.transformToTableData(companiesData);
        this.dataSource.data = transformedData;
        this.totalCount = companiesData.length;
      });
    this.subs.add(joinSubs);
    this.loadCompanies();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  loadCompanies(page = 1, pageSize = this.pageSize, search = ''): void {
    this.companyService
      .getCompaniesDetailsPaginated(
        page,
        pageSize,
        search,
        this.sortField,
        this.sortDirection
      )
      .subscribe(
        (response) => {
          // Log the API response to ensure it returns the correct pagination data
          console.log('API Response:', response);

          // Set totalCount to the current result count
          this.totalCount = response.meta.pagination.total;

          console.log('Total count:', this.totalCount); // Confirming total count here

          // Transform and set the data for the table
          this.dataSource.data = this.transformToTableData(response.data);
        },
        (error) => {
          console.error('Error fetching companies', error);
        }
      );
  }



  onSortChange(sort: Sort): void {
    this.sortField = sort.active;
    this.sortDirection = sort.direction || 'desc'; // Default to 'desc' if no direction
    this.loadCompanies(this.pageIndex + 1, this.pageSize);
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCompanies(this.pageIndex + 1);
  }
  onSearchChange(searchTerm: string): void {
    if (searchTerm.trim().length > 0) {
      this.loadCompanies(1, this.pageSize, searchTerm); // Reset to page 1 for search
    } else {
      this.loadCompanies(this.pageIndex + 1, this.pageSize); // Use current page index for regular load
    }
  }


  addCompany(): void {
    this.router.navigate([`/create-customer`]);
  }

  onUpdate(item: ICompany): void {
    this.router.navigate([`/update-customer/${item.id}`]);
  }

  onView(item: ICompany): void {
    this.router.navigate([`/view-customer/${item.id}`]);
  }

  onDelete(item: ICompany): void {
    const { company_name, id } = item;
    this.openConfirmationDialog('delete', company_name, id);
  }

  deleteCompany(id?: string): void {
    this.companyService.deleteCompany(id).subscribe(
      () => {
        this.loadCompanies(this.pageIndex + 1); // Reload the current page
        this.snackBar.open('Item deleted successfully', 'Close', {
          duration: 3000,
        });
      },
      (error) => {
        this.snackBar.open('Failed to delete item', 'Close', {
          duration: 3000,
        });
        console.error('Error deleting item', error);
      }
    );
  }
  navigateToDetails(): void {
    this.router.navigate(['/customer-management']);
  }
  navigateToAiApps(): void {
    this.router.navigate(['/apps-list']);
  }

  openConfirmationDialog(action: string, title: string, id?: string): void {
    const dialogConfig: ConfirmDialogConfig = {
      confirmationMessage: `Are you sure you want to ${action} the company ${title}?`,
      logo: action === 'delete' ? 'delete' : 'check_circle',
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        ...dialogConfig,
        action,
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        if (action === 'delete' && id) {
          this.deleteCompany(id);
        } else {
          console.log(`${action} confirmed`);
        }
      } else {
        console.log(`${action} canceled`);
      }
    });
  }

  transformToTableData(data: any[]): any[] {
    return data.map((item: any) => {
      const tableItem: any = {
        id: item.id,
        company_name: item.attributes.company_name || '',
        address: item.attributes.address || '',
        contact_person: item.attributes.contact_person || '',
        tax_id: item.attributes.tax_id || '',
        user_count: item.attributes.user_count || 0,
        company_type:
          item.attributes.Company_TypeID?.data?.attributes?.company_type || '',
        company_status: item.attributes.company_status || 'inactive',
        createdAt: item.attributes.createdAt || '',
        updatedAt: item.attributes.updatedAt || '',
        logo: item.attributes?.logo?.data?.attributes?.url
          ? `${environment.serverImageUrl}${item.attributes.logo.data.attributes.url}`
          : '',
        publishedAt: item.attributes.publishedAt || '',
      };
      return tableItem;
    });
  }
}
