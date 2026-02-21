from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.conf import settings


def notify_message(request, subject_template_path, text_template_path,
                   html_template_path, context, to):

    from_email = getattr(settings, "EMAIL_HOST_USER", 'no-reply@site-itm.ru')

    site_name = getattr(settings, 'ITM_SITE_NAME', 'ITM Site')

    context['site_name'] = site_name

    subject = render_to_string(subject_template_path, context=context, request=request)

    text_content = render_to_string(text_template_path, context=context, request=request)

    html_content = render_to_string(html_template_path, context=context, request=request)

    msg = EmailMultiAlternatives(subject, text_content, from_email, to)

    msg.attach_alternative(html_content, "text/html")

    msg.send()
