import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@regio-ki/regioki-core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'lib-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="const">
      <div class="container">
        <div class="login-container">
          <div class="left-side">
            <div class="illustration">
              <span>
                <svg
                  width="390"
                  height="391"
                  viewBox="0 0 390 391"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M215.516 339.031C215.268 339.031 215.019 338.965 214.795 338.835L93.9343 267.738C93.5915 267.538 93.3503 267.203 93.2666 266.814C93.1828 266.426 93.264 266.022 93.4926 265.697L190.837 127.364C191.288 126.721 192.175 126.567 192.817 127.019C193.459 127.471 193.614 128.357 193.162 128.999L96.7089 266.071L214.222 335.199L218.039 264.576C218.082 263.791 218.742 263.197 219.534 263.233C220.319 263.276 220.918 263.946 220.877 264.728L216.934 337.684C216.906 338.18 216.624 338.626 216.185 338.86C215.977 338.974 215.746 339.03 215.515 339.03L215.516 339.031ZM220.612 244.781C220.587 244.781 220.562 244.781 220.534 244.778C219.749 244.735 219.15 244.065 219.19 243.283L228.047 79.4373L205.436 111.567C204.984 112.209 204.098 112.364 203.456 111.912C202.814 111.46 202.659 110.574 203.111 109.932L228.572 73.7526C228.938 73.2346 229.601 73.0188 230.2 73.227C230.799 73.4352 231.188 74.0141 231.155 74.6464L222.029 243.438C221.989 244.195 221.362 244.781 220.613 244.781L220.612 244.781Z"
                    fill="#475D5D"
                  />
                  <path
                    d="M329.267 267.939H249.557C248.773 267.939 248.136 267.301 248.136 266.517C248.136 265.732 248.773 265.095 249.557 265.095H327.024L271.663 147.452L113.258 207.536C112.521 207.816 111.701 207.445 111.424 206.711C111.145 205.977 111.516 205.155 112.25 204.878L271.89 144.326C272.583 144.065 273.362 144.377 273.68 145.05L330.555 265.911C330.763 266.35 330.73 266.868 330.468 267.28C330.209 267.691 329.757 267.94 329.27 267.94L329.267 267.939ZM228.231 267.939H94.656C94.1811 267.939 93.7368 267.7 93.4728 267.307L65.0353 224.65C64.7941 224.29 64.7331 223.84 64.8651 223.426C64.9972 223.015 65.3095 222.685 65.7157 222.53L92.3098 212.442C93.0461 212.163 93.8663 212.534 94.143 213.267C94.4223 214.001 94.0516 214.824 93.3178 215.101L68.3917 224.554L95.4174 265.095H228.232C229.016 265.095 229.654 265.732 229.654 266.517C229.651 267.301 229.014 267.938 228.229 267.938L228.231 267.939Z"
                    fill="#475D5D"
                  />
                  <path
                    d="M66.2123 225.286C65.8772 225.286 65.5446 225.166 65.2805 224.938C64.8844 224.598 64.7092 224.064 64.8234 223.554L93.2609 95.582C93.3447 95.2012 93.5834 94.8711 93.9185 94.6705C94.2537 94.47 94.6574 94.4166 95.0306 94.5207L159.498 112.571C160.254 112.782 160.696 113.567 160.483 114.323C160.272 115.08 159.485 115.522 158.731 115.308L95.7088 97.6621L68.1676 221.591L142.554 193.377C143.287 193.098 144.11 193.469 144.387 194.202C144.666 194.936 144.295 195.759 143.562 196.036L66.7186 225.189C66.5536 225.25 66.3835 225.281 66.2134 225.281L66.2123 225.286ZM163.004 188.574C162.43 188.574 161.889 188.223 161.673 187.657C161.394 186.923 161.765 186.101 162.498 185.824L267.837 145.866L179.275 121.068C178.518 120.857 178.077 120.072 178.29 119.316C178.501 118.559 179.285 118.117 180.042 118.331L272.771 144.295C273.362 144.46 273.781 144.985 273.809 145.6C273.837 146.214 273.467 146.775 272.893 146.994L163.511 188.485C163.341 188.543 163.168 188.573 163.003 188.573L163.004 188.574Z"
                    fill="#475D5D"
                  />
                  <path
                    d="M322.156 346.14C313.53 346.14 306.516 339.125 306.516 330.5C306.516 321.875 313.531 314.859 322.156 314.859C330.781 314.859 337.796 321.875 337.796 330.5C337.796 339.125 330.781 346.14 322.156 346.14ZM322.156 317.702C315.1 317.702 309.359 323.443 309.359 330.5C309.359 337.556 315.1 343.297 322.156 343.297C329.212 343.297 334.953 337.556 334.953 330.5C334.953 323.443 329.212 317.702 322.156 317.702Z"
                    fill="#475D5D"
                  />
                  <path
                    d="M151.531 75.9837C142.905 75.9837 135.891 68.9683 135.891 60.3434C135.891 51.7186 142.906 44.7031 151.531 44.7031C160.156 44.7031 167.171 51.7186 167.171 60.3434C167.171 68.9683 160.156 75.9837 151.531 75.9837ZM151.531 47.5462C144.475 47.5462 138.734 53.287 138.734 60.3434C138.734 67.3998 144.475 73.1406 151.531 73.1406C158.587 73.1406 164.328 67.3998 164.328 60.3434C164.328 53.287 158.587 47.5462 151.531 47.5462Z"
                    fill="#475D5D"
                  />
                  <path
                    d="M286.602 246.608C286.226 246.608 285.863 246.45 285.591 246.189C285.327 245.925 285.18 245.557 285.18 245.186C285.18 244.808 285.329 244.44 285.591 244.175C286.124 243.65 287.076 243.65 287.602 244.175C287.871 244.445 288.021 244.808 288.021 245.186C288.021 245.557 287.871 245.925 287.602 246.189C287.34 246.45 286.977 246.608 286.602 246.608Z"
                    fill="#475D5D"
                  />
                  <path
                    d="M265.281 246.608C264.905 246.608 264.542 246.45 264.278 246.189C264.009 245.925 263.859 245.557 263.859 245.186C263.859 244.808 264.009 244.44 264.278 244.175C264.796 243.65 265.756 243.65 266.284 244.175C266.553 244.445 266.703 244.808 266.703 245.186C266.703 245.557 266.553 245.925 266.292 246.189C266.02 246.45 265.657 246.608 265.281 246.608H265.281Z"
                    fill="#475D5D"
                  />
                  <path
                    d="M243.953 246.608C243.577 246.608 243.214 246.45 242.943 246.189C242.679 245.925 242.531 245.557 242.531 245.186C242.531 244.808 242.681 244.447 242.943 244.175C243.476 243.65 244.428 243.65 244.954 244.175C245.223 244.445 245.372 244.808 245.372 245.186C245.372 245.557 245.223 245.925 244.961 246.189C244.692 246.45 244.329 246.608 243.953 246.608H243.953Z"
                    fill="#475D5D"
                  />
                  <path
                    d="M243.953 225.28C243.582 225.28 243.214 225.122 242.943 224.861C242.679 224.597 242.531 224.229 242.531 223.858C242.531 223.48 242.681 223.119 242.943 222.847C243.476 222.322 244.428 222.322 244.954 222.847C245.223 223.116 245.372 223.48 245.372 223.858C245.372 224.229 245.223 224.597 244.954 224.861C244.692 225.122 244.324 225.28 243.953 225.28Z"
                    fill="#475D5D"
                  />
                  <path
                    d="M243.953 203.959C243.577 203.959 243.214 203.802 242.95 203.541C242.681 203.276 242.531 202.908 242.531 202.538C242.531 202.159 242.681 201.799 242.943 201.527C243.476 201.001 244.428 201.001 244.954 201.527C245.223 201.796 245.372 202.159 245.372 202.538C245.372 202.908 245.223 203.276 244.961 203.541C244.692 203.802 244.329 203.959 243.953 203.959Z"
                    fill="#475D5D"
                  />
                  <path
                    d="M52 323.391H66.2188V337.609H52V323.391Z"
                    fill="#475D5D"
                  />
                  <path
                    d="M73.3281 323.391H87.5469V337.609H73.3281V323.391Z"
                    fill="#475D5D"
                  />
                  <path
                    d="M94.6562 323.391H108.875V337.609H94.6562V323.391Z"
                    fill="#475D5D"
                  />
                  <path
                    d="M115.977 323.391H130.195V337.609H115.977V323.391Z"
                    fill="#475D5D"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div class="right-side">
            <div class="signin-back-mobile">
              <p class="mobile-p">Sign-in</p>
            </div>
            <div class="svg-container">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="207"
                  height="48"
                  viewBox="0 0 207 48"
                  fill="none"
                >
                  <path
                    d="M10.8438 11.2433C10.8438 11.2433 10.8678 11.2097 10.887 11.1953H10.8438V11.2433Z"
                    fill="#008080"
                  />
                  <path
                    d="M37.6879 28.3352C39.3727 25.9544 40.4479 23.3384 40.9327 20.6888C42.1279 14.204 39.8239 7.48883 34.3999 3.37523C31.3183 1.04243 27.7327 -0.123967 24.0415 0.0104334C20.8495 0.120833 17.7247 1.19123 14.9983 3.09683C10.2895 6.39443 7.45272 11.9048 7.40952 17.8472L7.20312 47.8472L15.3631 47.9048L15.4591 34.0136L28.0111 47.9144L39.5647 47.9384L37.5055 45.7256L29.6575 37.2776C32.7007 34.3544 35.4847 31.4504 37.6879 28.3352ZM25.1839 31.0904C25.1167 31.1528 25.0495 31.2104 24.9775 31.268C24.7519 31.436 24.4735 31.484 24.2143 31.4168L24.0415 31.3592C23.9647 31.3304 23.8927 31.2872 23.8255 31.2344C23.7919 31.2056 23.7583 31.1816 23.7295 31.1528C23.3743 30.8168 23.0239 30.476 22.6831 30.1304L22.6111 30.0536C22.0015 29.4344 21.4159 28.796 20.8543 28.1288C20.2975 27.4712 19.7647 26.7896 19.2607 26.084C19.1791 25.9736 19.0975 25.8632 19.0207 25.7528C17.7679 23.9624 16.7071 22.0712 16.0783 19.9592C15.8047 19.0376 15.6319 18.1112 15.5983 17.1944C15.6116 16.9888 15.6079 16.2824 15.6079 16.2824C15.6079 16.2824 15.8719 14.4248 16.2511 13.5128C17.4031 10.7624 19.4287 8.98163 22.3183 8.21843C22.8079 8.08883 23.3215 8.04083 23.8255 7.94963C24.2047 7.88723 24.5839 7.88243 24.9631 7.94483C25.4047 8.01203 25.8511 8.05523 26.2879 8.15123C27.9055 8.51603 29.3263 9.29843 30.4495 10.3592C32.6095 12.3992 33.6991 15.4808 33.0895 18.62C32.9983 19.0856 32.8879 19.5416 32.7487 19.988C32.7103 20.1464 32.6623 20.3 32.6095 20.4584C32.4895 20.852 32.3407 21.2408 32.1631 21.6296C32.1439 21.6728 32.1295 21.716 32.1055 21.7592C31.8751 22.2968 31.6159 22.82 31.3327 23.3384C29.7151 26.2664 27.5935 28.7912 25.1839 31.0904Z"
                    fill="#008080"
                  />
                  <path
                    d="M29.3258 16.6453C29.441 19.3141 27.3002 21.5893 24.5546 21.7045C23.0618 21.7669 21.689 21.1141 20.7626 20.0437C20.0282 19.2133 19.5674 18.1285 19.5194 16.9381C19.4138 14.2597 21.5546 11.9893 24.2906 11.8789C25.5818 11.8261 26.777 12.3061 27.6794 13.1269C28.6394 13.9909 29.2634 15.2389 29.3258 16.6453Z"
                    fill="#005B5B"
                  />
                  <path
                    d="M30.5221 10.2812L30.4453 10.358C32.6053 12.3981 33.6949 15.4797 33.0853 18.6189C32.9941 19.0845 32.8837 19.5405 32.7445 19.9869C32.7061 20.1453 32.6581 20.2989 32.6053 20.4573C32.4853 20.8509 32.3365 21.2397 32.1589 21.6285C32.1397 21.6717 32.1253 21.7149 32.1013 21.7581C31.8709 22.2957 31.6117 22.8189 31.3285 23.3373C29.7109 26.2653 27.5893 28.7901 25.1797 31.0893C25.1125 31.1517 25.0453 31.2093 24.9733 31.2669C24.7477 31.4349 24.4693 31.4829 24.2101 31.4157L24.0373 31.3581C23.9605 31.3293 23.8885 31.2861 23.8213 31.2333C23.7877 31.2045 23.7541 31.1805 23.7253 31.1517C23.7349 31.1613 23.7109 31.1613 23.7109 31.1613L29.6533 37.2765C32.6965 34.3533 35.4805 31.4493 37.6837 28.3341C39.3685 25.9533 40.4437 23.3373 40.9285 20.6877L30.5221 10.2812Z"
                    fill="#005B5B"
                  />
                  <path
                    d="M74.922 30.042H67.694L66.498 33.5H62.676L69.202 15.326H73.44L79.966 33.5H76.118L74.922 30.042ZM73.934 27.13L71.308 19.538L68.682 27.13H73.934ZM81.4693 26.246C81.4693 24.79 81.7553 23.4987 82.3273 22.372C82.9167 21.2453 83.714 20.3787 84.7193 19.772C85.7247 19.1653 86.8427 18.862 88.0733 18.862C89.0093 18.862 89.902 19.07 90.7513 19.486C91.6007 19.8847 92.2767 20.422 92.7793 21.098V14.26H96.4713V33.5H92.7793V31.368C92.3287 32.0787 91.696 32.6507 90.8813 33.084C90.0667 33.5173 89.122 33.734 88.0473 33.734C86.834 33.734 85.7247 33.422 84.7193 32.798C83.714 32.174 82.9167 31.2987 82.3273 30.172C81.7553 29.028 81.4693 27.7193 81.4693 26.246ZM92.8053 26.298C92.8053 25.414 92.632 24.66 92.2853 24.036C91.9387 23.3947 91.4707 22.9093 90.8813 22.58C90.292 22.2333 89.6593 22.06 88.9833 22.06C88.3073 22.06 87.6833 22.2247 87.1113 22.554C86.5393 22.8833 86.0713 23.3687 85.7073 24.01C85.3607 24.634 85.1873 25.3793 85.1873 26.246C85.1873 27.1127 85.3607 27.8753 85.7073 28.534C86.0713 29.1753 86.5393 29.6693 87.1113 30.016C87.7007 30.3627 88.3247 30.536 88.9833 30.536C89.6593 30.536 90.292 30.3713 90.8813 30.042C91.4707 29.6953 91.9387 29.21 92.2853 28.586C92.632 27.9447 92.8053 27.182 92.8053 26.298ZM117.914 18.888C119.682 18.888 121.104 19.434 122.178 20.526C123.27 21.6007 123.816 23.1087 123.816 25.05V33.5H120.176V25.544C120.176 24.4173 119.89 23.5593 119.318 22.97C118.746 22.3633 117.966 22.06 116.978 22.06C115.99 22.06 115.202 22.3633 114.612 22.97C114.04 23.5593 113.754 24.4173 113.754 25.544V33.5H110.114V25.544C110.114 24.4173 109.828 23.5593 109.256 22.97C108.684 22.3633 107.904 22.06 106.916 22.06C105.911 22.06 105.114 22.3633 104.524 22.97C103.952 23.5593 103.666 24.4173 103.666 25.544V33.5H100.026V19.096H103.666V20.838C104.134 20.2313 104.732 19.7547 105.46 19.408C106.206 19.0613 107.02 18.888 107.904 18.888C109.031 18.888 110.036 19.1307 110.92 19.616C111.804 20.084 112.489 20.76 112.974 21.644C113.442 20.812 114.118 20.1447 115.002 19.642C115.904 19.1393 116.874 18.888 117.914 18.888ZM129.117 17.38C128.475 17.38 127.938 17.1807 127.505 16.782C127.089 16.366 126.881 15.8547 126.881 15.248C126.881 14.6413 127.089 14.1387 127.505 13.74C127.938 13.324 128.475 13.116 129.117 13.116C129.758 13.116 130.287 13.324 130.703 13.74C131.136 14.1387 131.353 14.6413 131.353 15.248C131.353 15.8547 131.136 16.366 130.703 16.782C130.287 17.1807 129.758 17.38 129.117 17.38ZM130.911 19.096V33.5H127.271V19.096H130.911ZM142.489 18.888C144.205 18.888 145.592 19.434 146.649 20.526C147.706 21.6007 148.235 23.1087 148.235 25.05V33.5H144.595V25.544C144.595 24.4 144.309 23.5247 143.737 22.918C143.165 22.294 142.385 21.982 141.397 21.982C140.392 21.982 139.594 22.294 139.005 22.918C138.433 23.5247 138.147 24.4 138.147 25.544V33.5H134.507V19.096H138.147V20.89C138.632 20.266 139.248 19.7807 139.993 19.434C140.756 19.07 141.588 18.888 142.489 18.888ZM169.02 30.042H161.792L160.596 33.5H156.774L163.3 15.326H167.538L174.064 33.5H170.216L169.02 30.042ZM168.032 27.13L165.406 19.538L162.78 27.13H168.032ZM189.737 20.968C189.737 21.9387 189.503 22.8487 189.035 23.698C188.584 24.5473 187.865 25.232 186.877 25.752C185.906 26.272 184.676 26.532 183.185 26.532H180.143V33.5H176.503V15.352H183.185C184.589 15.352 185.785 15.5947 186.773 16.08C187.761 16.5653 188.498 17.2327 188.983 18.082C189.486 18.9313 189.737 19.8933 189.737 20.968ZM183.029 23.594C184.034 23.594 184.78 23.3687 185.265 22.918C185.75 22.45 185.993 21.8 185.993 20.968C185.993 19.2 185.005 18.316 183.029 18.316H180.143V23.594H183.029ZM205.555 20.968C205.555 21.9387 205.321 22.8487 204.853 23.698C204.403 24.5473 203.683 25.232 202.695 25.752C201.725 26.272 200.494 26.532 199.003 26.532H195.961V33.5H192.321V15.352H199.003C200.407 15.352 201.603 15.5947 202.591 16.08C203.579 16.5653 204.316 17.2327 204.801 18.082C205.304 18.9313 205.555 19.8933 205.555 20.968ZM198.847 23.594C199.853 23.594 200.598 23.3687 201.083 22.918C201.569 22.45 201.811 21.8 201.811 20.968C201.811 19.2 200.823 18.316 198.847 18.316H195.961V23.594H198.847Z"
                    fill="#008080"
                  />
                </svg>
              </span>
            </div>
            <h1>Welcome RegioKI App</h1>
            <p>Please Sign in to your Account and start the adventure</p>

            <form (ngSubmit)="onSubmit()" [formGroup]="loginForm">
              <input
                type="email"
                formControlName="username"
                placeholder="Enter your Email"
                name="email"
                required
              />
              <input
                type="password"
                formControlName="password"
                placeholder="Enter your Password"
                name="password"
                required
              />

              <div class="remember-me">
                <input type="checkbox" id="rememberMe" />
                <label for="rememberMe">Remember me</label>
              </div>

              <button
                class="admin-button"
                type="submit"
                [disabled]="loginForm.invalid"
              >
                Sign in
              </button>
            </form>

            <div class="footer">
              <a href="#">Help</a>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
  .const {
            font-family: Arial, sans-serif;
            background-color: #f4f7fc;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

   .login-container {
   border-radius:13px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 600px;
  Width:1050px;
  background-color: white;
}

.left-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.left-side img {
  max-width: 100%; /* Make sure the image scales down on smaller screens */
}

.right-side {

  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 20px;
  max-width: 400px; /* Set a max width for the form */
}

.right-side h1 {
font-size:30px;
font-weight:500;
  margin-bottom: -10px;

}

.right-side p {

margin-right: 58px;
  margin-bottom: 20px;
  font-size:13px;
  color: #6c757d; /* Secondary text color */
}

form {
  width: 100%;
}

form input {
  width: 90%;
  padding: 15px;
  margin-bottom: 10px;
  margin-top: 10px;
  border: 1px solid #ced4da;
  border-radius: 10px;
  font-size:18px;
  
}

.remember-me {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
   font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
   font-size:16px;
   
}

.remember-me input[type="checkbox"] {
  margin-right: 7px;
  width:30px;
  
}

.admin-button {
  font-size:18px;
 height:44px;
  width: 99%;
  padding: 10px;
  background-color: #008080;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}


.admin-button:hover {
  background-color: #008080;
}

.admin-button:disabled {
    opacity:0.5;
    cursor: default;
}



.footer {
  margin-top: 20px;
}

.footer a {
  margin-right: 10px;
  color: #6c757d;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}
.signin-back-mobile{
  display:none;
}
 @media (max-width: 768px) {
.left-side, .footer{
display:none;
}

.signin-back-mobile {
  display: flex;
  align-items: center;
  gap: 8px; 
  font-size: 35px; 
  color:black;
  font-weight: bold;
  margin-bottom:60px;
}

.signin-back-mobile mat-icon {
  font-size: 25px; 
  cursor:pointer;
}

.signin-back-mobile .mobile-p {
  margin: 0;
  font-size: 25px; 
  color:black;
}
.const{
width:100vw;
overflow-x:hidden;
overflow-y:hidden;
background-color:white;
}
.login-container{
  height:900px;
margin-top:120px;
width:100vw;
overflow-x:hidden;
overflow-y:hidden;
}
.right-side{
 
margin-bottom:200px;
}
.right-side h1 {
font-size:33px;
font-weight:500;
}
.right-side p {
font-size:18px;
margin-top:10px;
}
form input {
  width: 90%;
  padding: 17px;
  margin-bottom: 10px;
  margin-top: 10px;
  border: 1px solid #ced4da;
  border-radius: 10px;
  font-size:16px;
  

}

.admin-button {
 width: 100%;
 border-radius: 8px;
padding: 25px;
font-size:15px;
 text-align: center;
 vertical-align: middle;
 line-height:3px;
}

}

  `,
})
export class AdminLoginComponent {
  loginForm: FormGroup;

  constructor(
    private _authService: AuthService,
    private router: Router,
    private _snackbar: MatSnackBar,
    private _fb: FormBuilder
  ) {
    this.loginForm = this._fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    const form = this.loginForm;

    const data = {
      email: form.controls['username'].value,
      password: form.controls['password'].value,
    };
    this._authService.adminlogin(data).subscribe((res) => {
      if (res.success == true) {
        localStorage.setItem('userDetails', JSON.stringify(res.data));
        localStorage.setItem('authToken', res.jwt);
        this.router.navigateByUrl('dashboard');

        this._authService.isUserLoggedIn$.next(true);
      } else {
        this._snackbar.open(res.message, undefined, { duration: 3000 });
      }
    });
  }
}
